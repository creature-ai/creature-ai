from os import listdir, path
import json

def get_results(res_path, category):
    dirname = res_path
    files = [f for f in listdir(dirname) if path.isfile(path.join(dirname, f))]
    selected_file = []
    result_list = []

    for f in files:
        if category.lower() in f.lower():
            selected_file = f
            break

    with open(path.join(dirname, selected_file)) as json_file:
        result_list = json.load(json_file)

    return result_list

