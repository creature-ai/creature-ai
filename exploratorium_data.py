from sklearn.preprocessing import MultiLabelBinarizer
import tensorflow as tf
import itertools
import json
import numpy as np
import itertools
from os import listdir
import run_classifier_with_tfhub
import bert_input

from_iterable = itertools.chain.from_iterable

def prepare_exploratium_data():
    path = '/content/gdrive/My Drive/OpenAiProject/exploratoruim/'
    print('read posts')
    posts = read_posts(path)
    print('add labels & split into posts into sections')
    labels = get_top_k_subjects(20, posts)
    print('labels: ' + str(labels))
    labeled_sections = list(from_iterable(get_labeled_sections(posts, labels)))
    print('shuffle the data to eliminate ordering in the scraped data before partitioning into train/test')
    np.random.seed(0)
    np.random.shuffle(labeled_sections)
    print('split into test and train data')
    test_sections = labeled_sections[0:int(len(labeled_sections)/5)]
    train_sections = labeled_sections[int(len(labeled_sections)/5):]
    print('load tokenizer')
    BERT_MODEL_HUB = 'https://tfhub.dev/google/bert_uncased_L-24_H-1024_A-16/1'
    tokenizer = run_classifier_with_tfhub.create_tokenizer_from_hub_module(BERT_MODEL_HUB)
    print('turn data into features')
    test_features = bert_input.data_list_to_features_text_truncated(test_sections, tokenizer)
    train_features = bert_input.data_list_to_features_text_truncated(train_sections, tokenizer)
    print('write data to TFRecords')
    print('writing test data')
    bert_input.write_features_to_tfrecords(test_features, 'gs://instructablesdata/final/exploratorium/test/0.tfrecord')
    print('writing train data')
    bert_input.write_features_to_tfrecords(train_features, 'gs://instructablesdata/final/exploratorium/train/0.tfrecord')
    print('done')

def read_posts(path):
  list_of_files = listdir(path)
  list_of_files.sort()
  posts = []
  for file_name in list_of_files: 
    with open(path + file_name, "r") as f:
        file_posts = json.load(f)
        posts.extend(file_posts)
  for i, p in enumerate(posts):
      p['post_id'] = i      
  return posts

def get_top_k_subjects(k, posts):
    subject_counts = tf.unique_with_counts(list(itertools.chain.from_iterable([x['subjects'] for x in posts])))
    subject_counts = list(zip(subject_counts.count.numpy(), subject_counts.y.numpy()))
    subject_counts.sort() 
    subjects = [x[1].decode('utf-8') for x in subject_counts]
    return subjects[-k:]

def steps_to_string(post):
  list_of_steps = post.get('assembly',[])
  all_text_steps = [step['step_description'] for step in list_of_steps]  
  all_text_steps2 = ' '.join(all_text_steps)
  return all_text_steps2

def post_to_labeled_sections(post, binarizer):
  assembly_text=steps_to_string(post)
  tools_and_materials_text = (' '.join(post.get('tools_and_materials', {}).get('stuff',[])))
  subjects = binarizer.fit_transform([post['subjects']])[0]
  post_id = post['post_id']
  texts = [
      {'text': assembly_text, 'section':'assembly', 'labels': subjects, 'post_id': post_id},
      {'text': post.get('going_further', ''), 'section': 'going_further', 'labels': subjects, 'post_id': post_id},
      {'text': post.get('description', ''), 'section': 'description', 'labels': subjects, 'post_id': post_id},
      {'text': post.get('whats_going_on', ''), 'section':'whats_going_on', 'labels': subjects, 'post_id': post_id},
      {'text': tools_and_materials_text, 'section': 'tools_and_materials', 'labels': subjects, 'post_id': post_id}
  ]
  return texts

def get_labeled_sections(posts, labels):
    binarizer = MultiLabelBinarizer(labels)
    return [post_to_labeled_sections(p, binarizer) for p in posts]
