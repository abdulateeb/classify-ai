"""
FastAPI backend application for waste material identification using Google Gemini AI.

This application serves a single API endpoint for waste material identification
from uploaded images using Google's Gemini model.
"""

import os
import base64
import logging
import traceback
from typing import Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# Configure logging to make sure messages appear in Railway and locally
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file for local development
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="Waste Material Identification API",
    description="AI-powered waste material identification using Google Gemini",
    version="1.0.0"
)

# This list explicitly allows your production and local frontends to make requests.
origins = [
    "https://wastecycle.dev",  # Your Vercel frontend URL
    "http://localhost:5173",   # Your default local development URL for Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Configure Google Gemini AI
# This will use the Railway variable in production and the .env variable locally.
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    logging.critical("FATAL: GEMINI_API_KEY not found in environment variables.")
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model with the specified version
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
model = genai.GenerativeModel(GEMINI_MODEL)


async def identify_waste_material(image_bytes: bytes, mime_type: str) -> str:
    """
    Asynchronous helper function to identify waste material from image bytes.
    """
    logging.info("Starting waste material identification with Gemini.")
    try:
        prompt_text = "Analyze this image and identify the primary material of the waste item shown. Respond with the name of the material (e.g., 'Plastic', 'Cardboard', 'Glass'), and also mention what have you observed in the image."
        
        image_part = {
            "mime_type": mime_type,
            "data": image_bytes
        }
        
        # Use the asynchronous version of the API call for performance
        response = await model.generate_content_async([prompt_text, image_part])
        
        identified_material = response.text.strip()
        logging.info(f"Gemini identified material as: {identified_material}")
        return identified_material
        
    except Exception as e:
        # This will now log the full error from the Gemini API call
        logging.error(f"Error during Gemini API call: {e}")
        logging.error(traceback.format_exc())
        raise Exception("Failed to get a response from the AI model.")


@app.post("/identify")
async def identify_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    POST endpoint for waste material identification.
    """
    logging.info(f"Received request for /identify with file: {file.filename}")
    
    if not file.content_type or not file.content_type.startswith('image/'):
        logging.warning(f"Invalid file type uploaded: {file.content_type}")
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_bytes = await file.read()
        logging.info(f"Read {len(image_bytes)} bytes from {file.filename}.")
        
        identified_material = await identify_waste_material(image_bytes, file.content_type)
        
        return {"material": identified_material}
        
    except Exception as e:
        # This block catches any error and prevents a 502 crash.
        logging.error(f"Caught exception in /identify endpoint: {e}")
        logging.error(traceback.format_exc())
        raise HTTPException(
            status_code=500, 
            detail="The server encountered an error during material identification."
        )


@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint to verify API is running."""
    return {"status": "healthy"}


@app.get("/")
async def root() -> Dict[str, Any]:
    """Root endpoint with API information."""
    return {"message": "Welcome to the Waste Material Identification API"}


# This block is only for running the app locally (e.g., `python api.py`).
# It will be ignored by Railway, which uses your Start Command.
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)