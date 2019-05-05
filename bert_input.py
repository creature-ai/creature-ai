import tensorflow as tf
import numpy as np 
import itertools

chain_iterable = itertools.chain.from_iterable


# Functions for converting data into bert features

def bert_features(tokens, max_seq_length, tokenizer):
  # leave room for 2 special tokens
  tokens_trimmed = tokens[:max_seq_length-2]
  # fill up the tokens
  tokens_final = []  
  tokens_final.append("[CLS]")
  tokens_final.extend(tokens_trimmed)
  tokens_final.append("[SEP]")
  num_tokens = len(tokens_final)
  # convert to ids
  input_ids = tokenizer.convert_tokens_to_ids(tokens_final)
  # pad out ids
  padding_length = (max_seq_length-num_tokens)
  input_ids.extend([0]*padding_length)
  # fill out other features
  segment_ids = [0] * max_seq_length
  input_mask = ([1] * num_tokens) + ([0] * padding_length)
  return input_ids, input_mask, segment_ids

def data_to_features_text_truncated(tokenizer, tokens, post_id, labels=None):
  input_ids, input_mask, segment_ids = bert_features(tokens, 512, tokenizer)
  features = {
      'input_ids': input_ids,
      'input_mask': input_mask,
      'segment_ids': segment_ids,
      'post_id': post_id
  }
  if labels:
      features['labels'] = labels
  return features

def chunks(L, n):
    for i in range(0, len(L), n):
        yield L[i:i+n]

def data_to_features_text_partitioned(tokenizer, tokens, post_id, labels=None):
    token_partitions = chunks(tokens, 510)
    return [
        data_to_features_text_truncated(
            tokenizer, 
            token_partition, 
            post_id, 
            labels) for token_partition in token_partitions]


def data_list_to_features_text_truncated(data_list, tokenizer):    
    return [
        data_to_features_text_truncated(
            tokenizer, 
            tokenizer.tokenize(d['text']), 
            d['post_id'],
            d.get('labels', None) 
            ) for d in data_list]

def data_list_to_features_text_partitioned(data_list, tokenizer):
    x = [
        data_to_features_text_partitioned(
            tokenizer, 
            tokenizer.tokenize(d['text']), 
            d['post_id'],
            d.get('labels', None) 
            ) for d in data_list]
    return chain_iterable(x)        

# Functions for writing TFRecords

def int_to_tfexample_feature(value):
    # handle cases where value is a single int, or a list of ints
    if type(value) == int:
        # if value is a single number, wrap it in a list
        return tf.train.Feature(int64_list=tf.train.Int64List(value=[value])) 
    if type(value) == list:
        return tf.train.Feature(int64_list=tf.train.Int64List(value=value))
    if type(value) == np.ndarray:
        return tf.train.Feature(int64_list=tf.train.Int64List(value=value.tolist()))
    else: 
        raise Exception('Feature value should be an int or list of ints. Found: ' + str(type(value)))

def serialized_example(features_dict):
    # all of our features are ints, so can handle them all with int_to_tfexample_feature
    features = {k:int_to_tfexample_feature(v) for k, v in features_dict.items()} 
    # create Example and serialize 
    return tf.train.Example(features=tf.train.Features(feature=features)).SerializeToString()

def write_features_to_tfrecords(features, out_file):
    serialized_examples = [serialized_example(feats) for feats in features]
    with tf.io.TFRecordWriter(out_file) as writer:
        for ex in serialized_examples:
            writer.write(ex)

# Functions for reading TFRecords 

def parsing_spec(max_seq_length, label_num):
    spec = {
        "input_ids": tf.FixedLenFeature([max_seq_length], tf.int64),
    	"input_mask": tf.FixedLenFeature([max_seq_length], tf.int64),
    	"segment_ids": tf.FixedLenFeature([max_seq_length], tf.int64),
    	'post_id': tf.io.FixedLenFeature([],tf.int64)
    }
    if label_num is not None:
        spec['labels'] = tf.FixedLenFeature([label_num], tf.int64)
    return spec

def input_fn_builder(
    dataset_path, 
    parsing_spec,
    shuffle,
    num_epochs,
    reader_num_threads,
    prefetch_buffer_size
    ):
  def input_fn(params):
    batch_size = params["batch_size"]

    def to_int32(example):
    # need to convert the int64 features to int32 for the benefit of TPU :D
	    for name in list(example.keys()):
		    t = example[name]
		    if t.dtype == tf.int64:
		    	t = tf.to_int32(t)
		    example[name] = t
	    return example
    
    dataset = tf.data.experimental.make_batched_features_dataset(
    	dataset_path,
    	batch_size,
    	parsing_spec,
    	reader_num_threads=reader_num_threads,
        num_epochs=num_epochs,
    	shuffle=shuffle,
    	prefetch_buffer_size=prefetch_buffer_size,
    	drop_final_batch=True
    ).map(to_int32)

    return dataset
  return input_fn 
