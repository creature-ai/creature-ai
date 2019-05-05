import tensorflow as tf
import os
import tensorflow_hub as hub
import optimization

def create_model(is_training, input_ids, input_mask, segment_ids, labels,
                 num_labels, bert_hub_module_handle):
  tags = set()
  if is_training:
    tags.add("train")
  bert_module = hub.Module(bert_hub_module_handle, tags=tags, trainable=True)
  bert_inputs = dict(
      input_ids=input_ids,
      input_mask=input_mask,
      segment_ids=segment_ids)
  bert_outputs = bert_module(
      inputs=bert_inputs,
      signature="tokens",
      as_dict=True)

  output_layer = bert_outputs["pooled_output"]

  hidden_size = output_layer.shape[-1].value

  output_weights = tf.get_variable(
      "output_weights", [num_labels, hidden_size],
      initializer=tf.truncated_normal_initializer(stddev=0.02))

  output_bias = tf.get_variable(
      "output_bias", [num_labels], initializer=tf.zeros_initializer())

  with tf.variable_scope("loss"):
    if is_training:
      output_layer = tf.nn.dropout(output_layer, keep_prob=0.9)

    logits = tf.matmul(output_layer, output_weights, transpose_b=True)
    logits = tf.nn.bias_add(logits, output_bias)
    
    multi_label_loss_1 = tf.nn.sigmoid_cross_entropy_with_logits(logits=logits, labels=labels)
    multi_label_per_example_loss=tf.reduce_sum(multi_label_loss_1, axis=1)
    multi_label_loss = tf.reduce_mean(multi_label_per_example_loss)
    
    probabilities = tf.nn.sigmoid(logits)

    return (multi_label_loss, multi_label_per_example_loss, logits, probabilities, output_layer)


def model_fn_builder(num_labels, learning_rate, num_train_steps,
                     num_warmup_steps, use_tpu, bert_hub_module_handle, extra_prediction_keys=[]):

  def model_fn(features, labels, mode, params):  # pylint: disable=unused-argument

    tf.logging.info("*** Features ***")
    for name in sorted(features.keys()):
      tf.logging.info("  name = %s, shape = %s" % (name, features[name].shape))

    input_ids = features["input_ids"]
    input_mask = features["input_mask"]
    segment_ids = features["segment_ids"]
    labels_ = None
    if features.get('labels', None) is not None:
      labels_ = tf.cast(features["labels"], tf.float32) # switch training vs predict
    else: 
      labels_ = tf.cast(tf.zeros([params['batch_size'], num_labels]), tf.float32)

    is_training = (mode == tf.estimator.ModeKeys.TRAIN)

    (total_loss, per_example_loss, logits, probabilities, output_layer) = create_model(
        is_training, input_ids, input_mask, segment_ids, labels_, num_labels,
        bert_hub_module_handle)

    output_spec = None
    if mode == tf.estimator.ModeKeys.TRAIN:
      train_op = optimization.create_optimizer(
          total_loss, learning_rate, num_train_steps, num_warmup_steps, use_tpu)

      output_spec = tf.contrib.tpu.TPUEstimatorSpec(
          mode=mode,
          loss=total_loss,
          train_op=train_op)

    elif mode == tf.estimator.ModeKeys.EVAL:

      def metric_fn(per_example_loss, labels_, logits):
        predictions = tf.argmax(logits, axis=-1, output_type=tf.int32)
        accuracy = tf.metrics.accuracy(labels_, predictions)
        loss = tf.metrics.mean(per_example_loss)
        return {
            "eval_accuracy": accuracy,
            "eval_loss": loss,
        }

      eval_metrics = (metric_fn, [per_example_loss, labels_, logits])
      output_spec = tf.contrib.tpu.TPUEstimatorSpec(
          mode=mode,
          loss=total_loss,
          eval_metrics=eval_metrics)

    elif mode == tf.estimator.ModeKeys.PREDICT:
      predictions = {
        "probabilities": probabilities,
        'post_id': features['post_id']
      }
      if 'embeddings' in extra_prediction_keys:
        predictions['embeddings'] = output_layer
      if 'labels' in extra_prediction_keys:
        predictions['labels'] = labels_
      if 'input_ids' in extra_prediction_keys:
        predictions['input_ids'] = features['input_ids']  
      output_spec = tf.contrib.tpu.TPUEstimatorSpec(
        mode=mode, 
        predictions=predictions)
    else:
      raise ValueError(
          "Only TRAIN, EVAL and PREDICT modes are supported: %s" % (mode))

    return output_spec

  return model_fn


def get_run_config(tpu_address, output_dir, num_tpu_cores=8, iterations_per_loop=100, save_checkpoint_steps=1000):
  tpu_cluster_resolver = tf.contrib.cluster_resolver.TPUClusterResolver(tpu_address)
  return tf.contrib.tpu.RunConfig(
    cluster=tpu_cluster_resolver,
    model_dir=output_dir,
    save_checkpoints_steps=save_checkpoint_steps,
    tpu_config=tf.contrib.tpu.TPUConfig(
        iterations_per_loop=iterations_per_loop,
        num_shards=num_tpu_cores,
        per_host_input_for_training=tf.contrib.tpu.InputPipelineConfig.PER_HOST_V2))


def MultilabelBertTPUEstimator(
    model_hub,
    tpu_address,
    output_dir,
    num_labels, 
    learning_rate, 
    num_train_steps, 
    num_warmup_steps,
    train_batch_size,
    eval_batch_size,
    predict_batch_size,
    extra_prediction_keys=[]):

  os.environ['TFHUB_CACHE_DIR'] = output_dir

  use_tpu = False  
  if tpu_address != None:
      use_tpu = True

  model_fn = model_fn_builder(
    num_labels=num_labels,
    learning_rate=learning_rate,
    num_train_steps=num_train_steps,
    num_warmup_steps=num_warmup_steps,
    use_tpu=use_tpu,
    bert_hub_module_handle=model_hub,
    extra_prediction_keys=extra_prediction_keys)

  estimator_from_tfhub = tf.contrib.tpu.TPUEstimator(
    use_tpu=use_tpu,
    model_fn=model_fn,
    config=get_run_config(
      tpu_address, 
      output_dir),
    train_batch_size=train_batch_size,
    eval_batch_size=eval_batch_size,
    predict_batch_size=predict_batch_size)

  return estimator_from_tfhub
