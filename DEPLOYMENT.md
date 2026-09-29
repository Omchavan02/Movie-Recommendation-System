# Deployment Guide: BDA Movie Recommendation System

This document outlines the production deployment architecture and configuration for hosting the Movie Recommendation System across Vercel, Render, and MongoDB Atlas.

---

## 1. System Architecture

```
                  +--------------------------------+
                  |         React Frontend         |
                  |            (Vercel)            |
                  +---------------+----------------+
                                  |
                                  | HTTP (REST)
                                  v
                  +--------------------------------+
                  |        Express Backend         |
                  |            (Render)            |
                  +-------+----------------+-------+
                          |                |
             MongoDB MQL  |                | HTTP (Internal / REST)
                          v                v
      +-----------------------+        +-----------------------+
      |     MongoDB Atlas     |        |   Django ML Service   |
      |   (cinemas.movies)    |        |       (Render)        |
      +-----------------------+        +-----------------------+
```

1. **Client Tier (Vercel):** Single Page Application (SPA) built with React. Communicates exclusively with the Express backend API.
2. **Application Tier (Render):** Express.js API gateway. Resolves movie titles against MongoDB, queries the Django ML service for recommendation IDs, fetches movie metadata from MongoDB, and returns JSON to the client.
3. **ML Service Tier (Render):** Django REST framework service running Gunicorn. Computes CountVectorizer cosine similarity rankings across movie tags using pre-calculated model matrices.
4. **Data Tier (MongoDB Atlas):** Managed MongoDB replica set containing collection `cinemas.movies` (4,803 movie records).

---

## 2. Local Development Environment Notice

- **Operating System:** Windows 11 + PowerShell.
- **Workflow:** Local development does **NOT** require Linux, WSL, Ubuntu, Docker, or Kubernetes.
- Local startup commands remain standard:
  - Root: `npm run dev` (runs frontend, backend, and Django concurrently)
  - Express: `cd Backend && npm run dev`
  - Django: `cd Movie_Python && python manage.py runserver 8000`
  - Frontend: `cd frontend && npm start`

---

## 3. Service Deployment Configurations

### A. React Frontend on Vercel

- **Platform:** Vercel (Web Application)
- **Root Directory:** `frontend`
- **Framework Preset:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **SPA Routing:** Configured via `frontend/vercel.json` with client-side rewrite:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/" }
    ]
  }
  ```
- **Environment Variables:**
  | Variable | Value | Description |
  |---|---|---|
  | `REACT_APP_API_URL` | `https://<render-express-app>.onrender.com` | Base URL of deployed Express backend |

---

### B. Express Backend on Render

- **Platform:** Render (Web Service)
- **Environment:** Node
- **Root Directory:** `Backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start` (or `node Server.js`)
- **Health Check Path:** `/api/health`
- **Environment Variables:**
  | Variable | Example / Description | Sensitivity |
  |---|---|---|
  | `PORT` | Auto-populated by Render (e.g. `10000`) | Non-secret |
  | `MONGODB_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cinemas?retryWrites=true&w=majority` | **Secret** |
  | `DJANGO_URL` | `https://<render-django-app>.onrender.com` | Non-secret |

---

### C. Django ML Service on Render

- **Platform:** Render (Web Service)
- **Environment:** Python 3
- **Root Directory:** `Movie_Python`
- **Build Command:**
  ```bash
  pip install -r requirements.txt && python ../ML_Model/generate_artifacts.py
  ```
- **Start Command:**
  ```bash
  gunicorn Movie.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --threads 2
  ```
- **Health Check Path:** `/api/health/`
- **Environment Variables:**
  | Variable | Example / Recommended Value | Sensitivity |
  |---|---|---|
  | `SECRET_KEY` | Long random cryptographic string | **Secret** |
  | `DEBUG` | `False` | Non-secret |
  | `ALLOWED_HOSTS` | `.onrender.com,localhost,127.0.0.1` | Non-secret |
  | `MODEL_DIR` | (Optional) Defaults to `Movie_Python` directory | Non-secret |

> [!IMPORTANT]
> **Gunicorn Concurrency on Render Free Tier:**
> Loading `similarity.pkl` requires ~190 MB RAM in Python. Each Gunicorn process maintains its own memory space. Running multiple worker processes will cause the service to exceed Render's 512 MB Free Tier memory limit and fail with an Out-of-Memory (OOM) error. Always use `--workers 1 --threads 2` on 512 MB instances.

---

## 4. ML Model Artifact Strategy & Resource Requirements

- **Model Artifacts:**
  - `movie_dict.pkl`: ~2.2 MB (DataFrame dictionary containing 4,806 movie rows).
  - `similarity.pkl`: ~184.8 MB (4806x4806 cosine similarity matrix).
- **Source Files (Tracked in Git):**
  - `ML_Model/movies.csv` (~5.7 MB)
  - `ML_Model/credits.csv` (~40.0 MB)
  - `ML_Model/generate_artifacts.py`
- **Why Artifacts are Not in Git:**
  - GitHub enforces a strict 100 MB per-file upload limit. At 184.8 MB, `similarity.pkl` cannot be committed to Git.
  - Both `.pkl` files are ignored in `.gitignore`.
- **Build-Time Generation:**
  - The Render build command executes `python ../ML_Model/generate_artifacts.py` during service compilation.
  - Artifact generation duration: **~9.6 seconds**.
  - **Peak Memory During Generation:** **~934 MB**.
- **Render Plan Verification:**
  - Verify that the target Render build instance provides at least 1 GB RAM to accommodate CountVectorizer matrix computation during the build step. Render build instances typically provide 2+ GB RAM during build phases.

---

## 5. MongoDB Atlas Data Setup

- **Database:** `cinemas`
- **Collection:** `movies`
- **Records:** 4,803 TMDB movies.
- **Seeding Pipeline:**
  - Seeding is decoupled from server startup. The production backend does **not** reseed the database on startup.
  - To seed or refresh data from a developer machine:
    ```powershell
    cd Backend
    npm run seed
    ```
  - The script parses `ML_Model/movies.csv` and executes idempotent bulk upserts matching each document by `id`.
