from flask import Flask
import json
from os import path, sys, listdir

ROOT_PATH = path.abspath(path.dirname(__file__))
MOCKS_PATH = path.join(ROOT_PATH, 'mocks')

# Change this path for your environment
INSTRUCTABLES_DATA_PATH = path.join(
    path.realpath(ROOT_PATH + '../../..'), 'demo-data', 'instructables_complete')

print('Path:', INSTRUCTABLES_DATA_PATH)

try:
    from flask_cors import CORS  # The typical way to import flask-cors
except ImportError:
    # Path hack allows examples to be run without installation.
    parentdir = path.dirname(path.dirname(path.abspath(__file__)))
    sys.path.insert(0, parentdir)

    from flask.ext.cors import CORS

app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app)
categories_file = []

with open(path.join(MOCKS_PATH, 'categories.json'), 'r') as json_file:
    categories_file = json.load(json_file)


@app.route('/categories')
def list_categories():
    response = json.dumps(categories_file['categories'])

    return response


@app.route('/categories/<name>')
def get_category_by_name(name):
    response = None
    for category in categories_file['categories']:
        if (category['name'] == name):
            response = category

    if not response:
        return response, 404

    return response


def get_category_results_list(name):
    response = []
    files_path = INSTRUCTABLES_DATA_PATH
    file_names = onlyfiles = [f for f in listdir(files_path) if path.isfile(path.join(files_path, f))]

    for file in file_names:
        print(file)
        if file.find(name.lower()) > -1:
            try:
                with open(path.join(files_path, file), 'r') as file:
                    response = response + json.load(file)
            except FileNotFoundError:
                print('File not found: ')

    return response


def filter_by_subcategory(subcategory, data_list):
    new_list = [x for x in data_list if x['channel'] == subcategory]

    return new_list

def map_result(element):
    new_elem = {}
    if len(element['steps']):
        step = element['steps'][0]
        if len(step['imgs']):
            new_elem['image'] = step['imgs'][0]


@app.route('/categories/<category>/results', defaults={'subcategory': None})
@app.route('/categories/<category>/results/<subcategory>')
def get_category_results(category, subcategory):
    results_list = get_category_results_list(category)

    if subcategory:
        response = filter_by_subcategory(subcategory, results_list)
    else:
        response = results_list

    return json.dumps(response)


if __name__ == '__main__':
    app.run(debug=True)
