import tensorflow as tf
import itertools
import json
import bert_input
import run_classifier_with_tfhub


def prepare_instructables_data():
    path = 'gs://instructablesdata/instructables20190411/'
    print('read posts')
    posts = read_posts(path)
    print('load tokenizer')
    BERT_MODEL_HUB = 'https://tfhub.dev/google/bert_uncased_L-24_H-1024_A-16/1'
    tokenizer = run_classifier_with_tfhub.create_tokenizer_from_hub_module(BERT_MODEL_HUB)
    print('process chunks')
    for i, c in enumerate(chunks(posts, 1000)):
        print('begin: ' + str(i))
        process_posts_chunk(tokenizer, c, i)

def chunks(L, n):
    for i in range(0, len(L), n):
        yield L[i:i+n]    

def process_posts_chunk(tokenizer, posts, i):
    parsed_posts = parse_posts(posts)
    features = bert_input.data_list_to_features_text_partitioned(parsed_posts, tokenizer)
    bert_input.write_features_to_tfrecords(features, 'gs://instructablesdata/final/instructables/' + str(i) +'.tfrecord')

def read_file(x):
    print('reading: ' + x)
    return json.loads(tf.io.gfile.GFile(x).read())

def read_posts(path):
    files_list = [path+x for x in tf.gfile.ListDirectory(path)]
    files_list.sort()    
    results = itertools.chain.from_iterable([read_file(f) for f in files_list])
    with_ids = []
    for i, r in enumerate(results):
        r['post_id'] = i
        with_ids.append(r)
    return with_ids    

def post_to_text_blob(p):
    return ' '.join([
        p['title'],
        p['description'],
        ' '.join([(s['step_title']+ ' '+ s['steps_text']) for s in p['steps']])      
    ])

def parse_posts(posts):
    return [{'post_id': p['post_id'], 'text': post_to_text_blob(p)} for p in posts]