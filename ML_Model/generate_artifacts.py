import os
import ast
import pickle
import shutil
import numpy as np
import pandas as pd
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    movies_csv = os.path.join(base_dir, 'movies.csv')
    credits_csv = os.path.join(base_dir, 'credits.csv')

    print(f"Reading movies from {movies_csv}...")
    movies = pd.read_csv(movies_csv)
    print(f"Reading credits from {credits_csv}...")
    credits = pd.read_csv(credits_csv)

    print("Merging on 'title'...")
    movies = movies.merge(credits, on='title')
    movies = movies[['movie_id', 'title', 'overview', 'genres', 'keywords', 'cast', 'crew']]
    movies.dropna(inplace=True)

    def convert_with_string(obj):
        L = []
        for i in ast.literal_eval(obj):
            L.append(i['name'])
        return L

    def convert_without_string(obj):
        L = []
        for i in obj:
            L.append(i['name'])
        return L

    def cast_3(obj):
        return ast.literal_eval(obj)[0:3]

    def director(obj):
        L = []
        for i in ast.literal_eval(obj):
            if i['job'] == 'Director':
                L.append(i['name'])
                break
        return L

    def string_to_list(obj):
        return str(obj).split()

    print("Parsing JSON columns...")
    movies['genres'] = movies['genres'].apply(convert_with_string)
    movies['keywords'] = movies['keywords'].apply(convert_with_string)
    movies['cast'] = movies['cast'].apply(cast_3)
    movies['cast'] = movies['cast'].apply(convert_without_string)
    movies['crew'] = movies['crew'].apply(director)
    movies['overview'] = movies['overview'].apply(string_to_list)

    print("Removing whitespace from tokens...")
    movies['genres'] = movies['genres'].apply(lambda x: [i.replace(' ', '') for i in x])
    movies['overview'] = movies['overview'].apply(lambda x: [i.replace(' ', '') for i in x])
    movies['keywords'] = movies['keywords'].apply(lambda x: [i.replace(' ', '') for i in x])
    movies['cast'] = movies['cast'].apply(lambda x: [i.replace(' ', '') for i in x])
    movies['crew'] = movies['crew'].apply(lambda x: [i.replace(' ', '') for i in x])

    print("Combining tags...")
    movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']

    new_df = movies[['movie_id', 'title', 'tags']].copy()
    new_df['tags'] = new_df['tags'].apply(lambda x: " ".join(x))
    new_df['tags'] = new_df['tags'].apply(lambda x: x.lower())

    print("Stemming tokens with PorterStemmer...")
    ps = PorterStemmer()

    def stem(text):
        y = []
        for i in text.split():
            y.append(ps.stem(i))
        return " ".join(y)

    new_df['tags'] = new_df['tags'].apply(stem)

    print("Vectorizing with CountVectorizer(max_features=5000, stop_words='english')...")
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(new_df['tags']).toarray()
    print(f"Vectors shape: {vectors.shape}")

    print("Calculating cosine_similarity...")
    similarity = cosine_similarity(vectors)
    print(f"Similarity matrix shape: {similarity.shape}")

    # Output paths
    ml_dict_path = os.path.join(base_dir, 'movie_dict.pkl')
    ml_sim_path = os.path.join(base_dir, 'similarity.pkl')

    print(f"Serializing artifacts to {base_dir}...")
    with open(ml_dict_path, 'wb') as f:
        pickle.dump(new_df.to_dict(), f)
    with open(ml_sim_path, 'wb') as f:
        pickle.dump(similarity, f)

    # Also copy to Movie_Python so Django finds them locally
    movie_python_dir = os.path.abspath(os.path.join(base_dir, '..', 'Movie_Python'))
    if os.path.isdir(movie_python_dir):
        py_dict_path = os.path.join(movie_python_dir, 'movie_dict.pkl')
        py_sim_path = os.path.join(movie_python_dir, 'similarity.pkl')
        print(f"Copying artifacts to {movie_python_dir}...")
        shutil.copy2(ml_dict_path, py_dict_path)
        shutil.copy2(ml_sim_path, py_sim_path)

    print("Artifact generation completed successfully.")

if __name__ == '__main__':
    main()
