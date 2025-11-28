# 🚀 Deployment Guide (Render + Vercel)

## Hosting the Backend (FastAPI) and Frontend (Next.js)

This guide shows how to deploy the AI Connection project using **Render** (backend) and **Vercel** (frontend). Copy/paste directly into Canvas.

---

# PART 1 — Deploy Backend (FastAPI) on Render

## 1. Prepare Backend Files

Ensure your GitHub repo includes:

```
backend/
    main.py
    requirements.txt
```

`requirements.txt` example:

```
fastapi
uvicorn
requests
google-genai
python-dotenv
```

## 2. Create a Render Account

Go to: [https://render.com/](https://render.com/)
Sign up using Google.

## 3. Create a New Web Service

1. Click **New → Web Service**
2. Select your GitHub repo (**must be a personal repo**)
3. Configure settings:

**Root Directory**: `backend`

**Build Command**:

```
pip install -r requirements.txt
```

**Start Command**:

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance Type**: Free

## 4. Deploy Backend

Render will install dependencies and start FastAPI.
You will receive a public backend URL like:

```
https://your-backend.onrender.com
```

Test it:

```
https://your-backend.onrender.com/docs
```

---

# PART 2 — Deploy Frontend (Next.js) on Vercel

## 1. Go to Vercel

[https://vercel.com/](https://vercel.com/)
Click **New Project**.

## 2. Import Your GitHub Repo

Select the same repo.
Choose **Next.js** when asked.

## 3. Configure Project Settings

### Root Directory

```
frontend
```

### Environment Variables

Add:

```
NEXT_PUBLIC_BACKEND_URL = https://your-backend.onrender.com
```

This connects the frontend to the Render backend.

## 4. Deploy Frontend

Vercel will build and deploy automatically.
You will receive a public site URL like:

```
https://your-frontend.vercel.app
```

---

# PART 3 — Connecting Frontend to Backend

Your Next.js code uses:

```
process.env.NEXT_PUBLIC_BACKEND_URL
```

to communicate with the backend.

Once deployed:

* Frontend (Vercel) sends request → Backend (Render)
* Backend responds with AI-generated content
* Frontend displays it

---

# PART 4 — Testing the Full App

1. Open Vercel frontend URL
2. Enter your **own API key** in the UI (keys are not stored)
3. Try sending a prompt

If everything is correct, the app will work end-to-end.

---

# Troubleshooting

### Backend 404

Check Render settings:

* Root directory = `backend`
* Correct start command

### CORS Error

Add to `main.py`:

```
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend cannot reach backend

Check Vercel env variable:

```
NEXT_PUBLIC_BACKEND_URL
```

---

# Deployment Complete!

You now have:

* Backend hosted on Render
* Frontend hosted on Vercel
* Working full-stack AI web application
