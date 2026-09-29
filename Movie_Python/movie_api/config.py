
import os
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOVIE_DICT_PATH = os.path.join(BASE_DIR, 'movie_dict.pkl')
SIMILARITY_PATH = os.path.join(BASE_DIR, 'similarity.pkl')

def load_pickle_file(file_path):
    with open(file_path, 'rb') as file:
        return pickle.load(file)

movie_dict = load_pickle_file(MOVIE_DICT_PATH)
similarity = load_pickle_file(SIMILARITY_PATH)
