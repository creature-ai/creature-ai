


TRAIN_BATCH_SIZE = 32
EVAL_BATCH_SIZE = 8
PREDICT_BATCH_SIZE = 32*4
LEARNING_RATE = 2e-5
NUM_TRAIN_EPOCHS = 1.0
# Warmup is a period of time where hte learning rate 
# is small and gradually increases--usually helps training.
WARMUP_PROPORTION = 0.1
# Model configs
SAVE_CHECKPOINTS_STEPS = 1000
SAVE_SUMMARY_STEPS = 100
num_train_steps=14000
num_warmup_steps=1000

# Compute number of train and warmup steps from batch size
#train_examples = train_input_examples
#num_train_steps = int(len(train_examples) / TRAIN_BATCH_SIZE * NUM_TRAIN_EPOCHS)
#num_warmup_steps = int(num_train_steps * WARMUP_PROPORTION)

# Setup TPU related config
NUM_TPU_CORES = 8
ITERATIONS_PER_LOOP = 100




MAX_SEQ_LENGTH=512
predict_input_fn = predict_input_fn_builder('gs://instructablesdata/prod/bert_input_tfrecords_prediction_per_post/*')
predictions=estimator_from_tfhub.predict(input_fn=predict_input_fn)

def _float_feature_list(value):
  """Returns a float_list from a float / double."""
  return tf.train.Feature(float_list=tf.train.FloatList(value=value))

def _int64_feature(value):
  """Returns an int64_list from a bool / enum / int / uint."""
  return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))

def _int64_features(value):
  """Returns an int64_list from a bool / enum / int / uint."""
  return tf.train.Feature(int64_list=tf.train.Int64List(value=value))

def serialize_bert_output_example(x):
  feature = {
      'predictions': _float_feature_list(x['probabilities']),
      'post_id': _int64_feature(x['post_id']),
      'input_ids': _int64_features(x['input_ids']),
      'embeddings': _float_feature_list(x['embeddings'])
  }
      
  example_proto = tf.train.Example(features=tf.train.Features(feature=feature))
  return example_proto.SerializeToString()


writer = None
for i, x in enumerate(predictions):
  if i % 20000 == 0:
    print(i)
    if writer is not None:
      writer.flush()
      writer.close()
    writer = tf.io.TFRecordWriter('gs://instructablesdata/prod/predictions/instructables_embeddings/'+str(i)+'.tfrecord')
  writer.write(serialize_bert_output_example(x))  



def predict_input_fn_builder(dataset_path, seq_length=512):
  def input_fn(params):
    batch_size = params["batch_size"]
    output_buffer_size = batch_size * 100
    
    dataset = tf.data.experimental.make_batched_features_dataset(
    	dataset_path,
    	batch_size,
    	{
    		"input_ids": tf.FixedLenFeature([seq_length], tf.int64),
    		"input_mask": tf.FixedLenFeature([seq_length], tf.int64),
    		"segment_ids": tf.FixedLenFeature([seq_length], tf.int64),
    		'post_id': tf.io.FixedLenFeature([], tf.int64), 
    	},
    	reader_num_threads=1,
        num_epochs=1,
    	shuffle=False,
    	prefetch_buffer_size=output_buffer_size,
    	drop_final_batch=True
    ).prefetch(8).map(to_int32)

    return dataset
  return input_fn  


def to_int32(example):
	for name in list(example.keys()):
		t = example[name]
		if t.dtype == tf.int64:
			t = tf.to_int32(t)
		example[name] = t

	return example

# Force TF Hub writes to the GS bucket we provide.
