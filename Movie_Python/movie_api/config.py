import os
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def find_artifact_path(filename):
    model_dir = os.environ.get('MODEL_DIR', BASE_DIR)
    primary_path = os.path.join(model_dir, filename)
    if os.path.exists(primary_path):
        return primary_path

    fallback_path = os.path.abspath(os.path.join(BASE_DIR, '..', 'ML_Model', filename))
    if os.path.exists(fallback_path):
        return fallback_path

    raise FileNotFoundError(
        f"Artifact '{filename}' not found at '{primary_path}' or '{fallback_path}'. "
        "Please generate artifacts using 'python ML_Model/generate_artifacts.py'."
    )

def load_pickle_file(file_path):
    with open(file_path, 'rb') as file:
        return pickle.load(file)

movie_dict_path = find_artifact_path('movie_dict.pkl')
similarity_path = find_artifact_path('similarity.pkl')

movie_dict = load_pickle_file(movie_dict_path)
similarity = load_pickle_file(similarity_path)
