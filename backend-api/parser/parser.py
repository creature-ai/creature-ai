from os import path, getcwd, listdir, getenv
from dotenv import load_dotenv
import json

load_dotenv()

RESULTS_PATH = path.realpath(path.dirname(__file__) + '/../mocks/results')
CLASSIFIED_PATH = path.join(getenv('DEMO_DATA_PATH'), 'classified')
INSTRUCTABLES_PATH = path.join(getenv('DEMO_DATA_PATH'), 'instructables_complete')

def init():
    print('RESULTS_PATH:', RESULTS_PATH)
    print('CLASSIFIED_PATH:', CLASSIFIED_PATH)
    print('INSTRUCTABLES_PATH:', INSTRUCTABLES_PATH)
    json_files = get_scrap_files_list()
    urls_files = get_classified_files_list()
    exit(0)

    for u in urls_files:
        matches = []
        print('Reading urls file --->>>', u);
        with open(CLASSIFIED_PATH + '/' + u) as urls_file:
            urls = urls_file.readlines()

            for f in json_files:
                json_data = get_scrap_file_json(f)
                matches += compare_file(json_data, urls, u, f)

        file_name = u.replace('classified_by_max_1_', '')
        print('Writing file --->>>', file_name + '.json', 'Matches --->>>', len(matches))
        write_file(file_name, matches)


def write_file(name, data):
    with open(RESULTS_PATH + '/' + name + '.json', 'w') as outfile:
        json.dump(data, outfile)


def compare_file(json_data, urls, name, json_name):
    json_len = len(json_data)
    matches = []

    print('Comparing JSON --->>>', json_name, '| Elements:', json_len, end = ' ')
    for url in urls:
        counter = 1
        ## print('Comparing URL --->>>', url)
        for item in json_data:
            counter += 1

            if (item['url'] in url) or (url in item['url']):
                ## Match url
                matches.append(item)

    print('| Matches:', len(matches))

    return matches


def get_files_list(dirname):
    return [f for f in listdir(dirname) if path.isfile(path.join(dirname, f))]


def get_classified_files_list():
    return get_files_list(CLASSIFIED_PATH)


def get_scrap_files_list():
    return get_files_list(INSTRUCTABLES_PATH)


def get_scrap_file_json(name):
    try:
        with open(INSTRUCTABLES_PATH + '/' + name, 'r') as file:
            file_data = json.load(file)
            return file_data
    except Exception as e:
        print('Exception in ', e)

init()