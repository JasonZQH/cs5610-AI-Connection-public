# Class12-GenAI

FastAPI + Next.js demo used in class to showcase multiple AI integration patterns: basic chat, streaming responses, function-calling to drive UI state, and BYOK Gemini image generation.

## Project Layout
- `backend/`: FastAPI server with OpenAI chat endpoints and Gemini 2.5 image generation (BYO API key per request).
- `frontend/`: Next.js 16 React app that calls the backend at `http://localhost:8000`.

## Prerequisites
- Python 3.10+ with `pip` (or `uv`/`pipenv`) available.
- Node.js 18.18+ with `npm`.
- OpenAI API key for server-side chat levels (stored in `backend/.env`).
- Google Gemini API key supplied by each user in the UI for Level 4 image generation.

## Backend: Install & Start
1) `cd backend`
2) (Recommended) create a virtualenv: `python -m venv venv && source venv/bin/activate`
3) Install deps: `pip install fastapi uvicorn python-dotenv openai google-genai`
4) Create `backend/.env` with `OPENAI_API_KEY=your_openai_key`
5) Run the API: `uvicorn main:app --reload --port 8000`

## Frontend: Install & Start
1) `cd frontend`
2) Install deps: `npm install`
3) Start dev server: `npm run dev` (opens http://localhost:3000, expects backend on port 8000)
4) Production build/start: `npm run build` then `npm start`

## Usage Notes
- Start the backend first, then the frontend UI.
- Level 4 image generation prompts for a Gemini API key; it is used only for that request and not stored.
