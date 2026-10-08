# 🚀 Vocentra Deployment Guide

## 1. Deploying Frontend to Vercel (Recommended)

Vocentra is pre-configured for one-click deployment on **Vercel**.

### Quick Steps:
1. Push your repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import the `vocentra` repository.
4. **Project Settings**:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Build Command**: `cd frontend && npm run build` (or leave default if Root Directory is `frontend`)
   - **Output Directory**: `frontend/dist` (or `dist` if Root Directory is `frontend`)
5. **Environment Variables** (Optional):
   - `VITE_API_URL`: URL of your live FastAPI backend (e.g. `https://your-api.onrender.com`).
   - *Note: If no external backend is configured, Vocentra automatically runs in interactive demo mode on Vercel with built-in serverless endpoints in `/api`.*
6. Click **Deploy**.

---

## 2. Local Development

### Run Backend (FastAPI):
```bash
pip install -r requirements.txt
python run.py
```
Backend starts on `http://localhost:8000`.

### Run Frontend (Vite Dev Server):
```bash
cd frontend
npm install
npm run dev
```
Frontend launches at `http://localhost:5173`.

---

## 3. Production Local Build

To test the production build locally:
```bash
npm run build
```
This generates the optimized bundle in `frontend/dist`.
