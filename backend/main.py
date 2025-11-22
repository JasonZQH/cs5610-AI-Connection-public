import os
import time
import json
import base64
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai

# ==========================================
# NEW: Import the new Google Gen AI SDK
# ==========================================
from google import genai
from google.genai import types

# ==========================================
# load .env
# ==========================================
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"

print(f"Loading configuration: {env_path}")
load_dotenv(dotenv_path=env_path)

# Default Server Key (for Levels 1-3)
server_api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=server_api_key if server_api_key else "sk-simulation-placeholder")

# ==========================================
# FastAPI Setup
# ==========================================
app = FastAPI(title="AI Integration Demo Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ImageRequest(BaseModel):
    message: str
    user_api_key: str

# --- Level 1: Standard Request ---
@app.post("/api/level1/basic")
async def chat_basic(request: ChatRequest):
    if not server_api_key or client.api_key == "sk-simulation-placeholder":
        time.sleep(1)
        return {"response": f"[Simulation] Backend running, but no server API Key found. You said: {request.message}"}

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.message}],
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"response": f"OpenAI Error: {str(e)}"}

# --- Level 2: Streaming ---
@app.post("/api/level2/stream")
async def chat_stream(request: ChatRequest):
    def event_stream():
        if not server_api_key or client.api_key == "sk-simulation-placeholder":
            fake_text = "This is a simulated streaming response because the Server API Key is missing... " * 3
            for word in fake_text.split(" "):
                yield f"data: {word} \n\n"
                time.sleep(0.1)
            yield "data: [DONE]\n\n"
            return

        try:
            stream = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": request.message}],
                stream=True,
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    clean = content.replace("\n", "\\n")
                    yield f"data: {clean}\n\n"
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

# --- Level 3: Generative UI ---
@app.post("/api/level3/ui")
async def chat_ui(request: ChatRequest):
    tools = [{
        "type": "function",
        "function": {
            "name": "update_dashboard_ui",
            "description": "Updates the dashboard UI theme and status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "theme": {"type": "string", "enum": ["light", "dark", "blue", "red"]},
                    "status_message": {"type": "string"}
                },
                "required": ["theme", "status_message"],
            },
        },
    }]

    if not server_api_key or client.api_key == "sk-simulation-placeholder":
        time.sleep(1)
        return {"type": "ui_update", "data": {"theme": "blue", "status_message": "Simulation Mode Active"}}

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a UI assistant. Use the update_dashboard_ui function."},
                {"role": "user", "content": request.message}
            ],
            tools=tools,
            tool_choice={"type": "function", "function": {"name": "update_dashboard_ui"}}
        )
        
        tool_calls = response.choices[0].message.tool_calls
        
        if tool_calls:
            args = json.loads(tool_calls[0].function.arguments)
            return {"type": "ui_update", "data": args}
        
        return {"type": "error", "message": "No UI update triggered"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Level 4: Gemini 2.5 Image Generation (Updated for New SDK) ---
@app.post("/api/level4/image")
async def generate_image(request: ImageRequest):
    if not request.user_api_key:
         raise HTTPException(status_code=400, detail="API Key is required for this level.")

    try:
        # 1. Initialize the NEW Client with User's Key
        gemini_client = genai.Client(api_key=request.user_api_key)
        
        # 2. Call the API using the official Gemini 2.5 syntax
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash-image", # Or "gemini-2.5-flash-image" depending on exact rollout availability
            contents=[request.message],
        )

        # 3. Extract the image data
        # The new SDK returns inline_data in the parts
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    # part.inline_data.data is the raw bytes
                    image_bytes = part.inline_data.data
                    
                    # Convert to Base64 for the frontend
                    b64_string = base64.b64encode(image_bytes).decode('utf-8')
                    return {"status": "success", "image_base64": b64_string}

        return {"status": "error", "message": "No image found in response."}

    except Exception as e:
        print(f"Gemini Error: {e}")
        # Return the error message to frontend for easier debugging
        raise HTTPException(status_code=500, detail=str(e))