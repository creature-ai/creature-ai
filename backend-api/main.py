from flask import Flask
from flask_cors import CORS
import json
from os import path, sys, listdir

from results import results

ROOT_PATH = path.abspath(path.dirname(__file__))
MOCKS_PATH = path.join(ROOT_PATH, 'mocks')

RESULTS_PATH = path.join(MOCKS_PATH, 'results')
CATEGORIES_FILE = path.join(MOCKS_PATH, 'categories.json')
FILTERS_FILE = path.join(MOCKS_PATH, 'filters.json')

print('Results Path:', RESULTS_PATH)
print('Categories file path:', CATEGORIES_FILE)

app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app)
categories = []
filters = []

with open(CATEGORIES_FILE, 'r') as json_file:
    categories = json.load(json_file)

with open(FILTERS_FILE, 'r') as json_file:
    filters = json.load(json_file)


@app.route('/categories')
def list_categories():
    return json.dumps(categories)


@app.route('/categories/<name>')
def get_category_by_name(name):
    response = None
    for category in categories:
        if (category['name'] == name):
            response = category

    if not response:
        return response, 404

    return response


@app.route('/categories/<category>/results')
def get_category_results(category):
    results_list = results.get_results(RESULTS_PATH, category)

    return json.dumps(results_list)

@app.route('/filters')
def get_filters():
    return json.dumps(filters)


if __name__ == '__main__':
    app.run(debug=True)
