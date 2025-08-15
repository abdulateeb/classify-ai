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

# --- CHANGE 1: CONFIGURE LOGGING ---
# Add detailed logging to capture all errors, especially silent ones.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="Waste Material Identification API",
    description="AI-powered waste material identification using Google Gemini",
    version="1.0.0"
)

# --- CHANGE 2: CONFIGURE CORS MORE SPECIFICALLY ---
# Replace wildcard with the actual frontend origin for better security.
origins = [
    "https://wastecycle.dev",  # Your Vercel frontend URL
    "http://localhost:5173",   # For local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini AI
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    # This error will happen on startup if the key is missing
    logging.critical("GEMINI_API_KEY not found in environment variables. Application cannot start.")
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
model = genai.GenerativeModel(GEMINI_MODEL)


async def identify_waste_material(image_bytes: bytes, mime_type: str) -> str:
    """
    Asynchronous helper function to identify waste material from image bytes.
    """
    logging.info("Starting waste material identification with Gemini.")
    try:
        # Create the multimodal prompt with image and text
        prompt_text = "Analyze this image and identify the primary material of the waste item/items shown. Respond with the name of the material if not then respond what you observe in the image (e.g., 'Plastic', 'Cardboard', 'Glass')."

        # Prepare the content for Gemini API
        image_part = {
            "mime_type": mime_type, # --- CHANGE 4: Use dynamic MIME type
            "data": image_bytes
        }
        
        # --- CHANGE 3: USE ASYNCHRONOUS API CALL ---
        # Switched to the async version to prevent server timeouts
        response = await model.generate_content_async([prompt_text, image_part])
        
        identified_material = response.text.strip()
        logging.info(f"Gemini identified material as: {identified_material}")
        return identified_material
        
    except Exception as e:
        # This will now log the detailed error from the Gemini API call
        logging.error(f"Error during Gemini API call: {e}")
        logging.error(traceback.format_exc())
        raise Exception(f"Failed to identify waste material: {str(e)}")


@app.post("/identify")
async def identify_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    POST endpoint for waste material identification.
    """
    logging.info(f"Received request for endpoint /identify with file: {file.filename}")
    
    # Validate file upload
    if not file:
        logging.warning("Upload attempt with no file.")
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        logging.warning(f"Invalid file type uploaded: {file.content_type}")
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_bytes = await file.read()
        logging.info(f"Read {len(image_bytes)} bytes from {file.filename}.")
        
        identified_material = await identify_waste_material(image_bytes, file.content_type)
        
        return {"material": identified_material}
        
    except Exception as e:
        # This is the crucial block that will catch the crash and log it.
        logging.error(f"Caught exception in /identify endpoint: {e}")
        logging.error(traceback.format_exc()) # Provides a full traceback in logs
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred during material identification."
        )


@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint to verify API is running."""
    return {
        "status": "healthy",
        "service": "Waste Material Identification API",
        "model": GEMINI_MODEL,
        "api_key_configured": bool(GOOGLE_API_KEY)
    }


@app.get("/")
async def root() -> Dict[str, Any]:
    """Root endpoint with API information."""
    return {
        "message": "Welcome to the Waste Material Identification API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)