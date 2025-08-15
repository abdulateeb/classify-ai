"""
FastAPI backend application for waste material identification using Google Gemini AI.

This application serves a single API endpoint for waste material identification
from uploaded images using Google's Gemini model.
"""

import os
import base64
from typing import Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="Waste Material Identification API",
    description="AI-powered waste material identification using Google Gemini",
    version="1.0.0"
)

# CORS intentionally disabled; frontend should use a dev/prod proxy for same-origin requests.

# Configure Google Gemini AI
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
model = genai.GenerativeModel(GEMINI_MODEL)


async def identify_waste_material(image_bytes: bytes) -> str:
    """
    Asynchronous helper function to identify waste material from image bytes.
    
    Args:
        image_bytes: Raw bytes of the uploaded image
        
    Returns:
        str: Identified material type
        
    Raises:
        Exception: If material identification fails
    """
    try:
        # Convert image bytes to base64 for Gemini API
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # Create the multimodal prompt with image and text
        prompt_text = "Analyze this image and identify the primary material of the waste item shown."
        
        # Prepare the content for Gemini API
        content = [
            prompt_text,
            {
                "mime_type": "image/jpeg",  # Assuming JPEG format
                "data": image_base64
            }
        ]
        
        # Generate content using Gemini model
        response = model.generate_content(content)
        
        # Extract and return the identified material
        identified_material = response.text.strip()
        return identified_material
        
    except Exception as e:
        raise Exception(f"Failed to identify waste material: {str(e)}")


@app.post("/identify")
async def identify_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    POST endpoint for waste material identification.
    
    Accepts multipart/form-data with file upload and returns identified material.
    
    Args:
        file: Uploaded image file
        
    Returns:
        Dict containing the identified material
        
    Raises:
        HTTPException: If file processing or identification fails
    """
    # Validate file upload
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Validate file type (optional but recommended)
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read the raw bytes from the uploaded file
        image_bytes = await file.read()
        
        # Call the helper function to identify waste material
        identified_material = await identify_waste_material(image_bytes)
        
        # Return JSON response with identified material
        return {"material": identified_material}
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Material identification failed: {str(e)}"
        )


@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint to verify API is running."""
    return {
        "status": "healthy",
        "service": "Waste Material Identification API",
        "model": GEMINI_MODEL,
        "api_configured": bool(GOOGLE_API_KEY)
    }


@app.get("/")
async def root() -> Dict[str, Any]:
    """Root endpoint with API information."""
    return {
        "message": "Waste Material Identification API",
        "version": "1.0.0",
        "model": GEMINI_MODEL,
        "endpoints": {
            "identify": "/identify (POST)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(app, host=host, port=port)
