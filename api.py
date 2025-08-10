"""
FastAPI backend application for waste material identification using Google Gemini AI.

This application serves both API endpoints and React frontend for a complete
waste classification application.
"""

import os
import io
from typing import Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="WasteCycle API",
    description="AI-powered waste material classification using Google Gemini",
    version="1.0.0"
)

# Configure CORS middleware for same-domain deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini AI
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Gemini model with correct model name
model = genai.GenerativeModel('gemini-2.5-flash')


def classify_waste_material(image: Image.Image) -> dict:
    """
    Classify waste material from PIL Image and return detailed analysis.
    
    Args:
        image: PIL Image object
        
    Returns:
        dict: Classification results with material, recyclability, confidence, and recommendations
        
    Raises:
        Exception: If classification fails
    """
    prompt = """
    Analyze this image and identify the primary waste material. Provide a detailed response with:
    
    1. **Material type** (be very specific - e.g., "**Plastic bottle (PET)**", "**Aluminum can**", "**Cardboard box**")
    2. **Whether it's recyclable** (Yes/No)
    3. **Confidence level** (0-100%)
    4. **Detailed disposal recommendations**
    
    Format your response exactly as follows:
    Material: [specific material type with formatting]
    Recyclable: [Yes/No]
    Confidence: [percentage number only]
    Recommendations: [detailed disposal and recycling instructions]
    """
    
    try:
        response = model.generate_content([prompt, image])
        text = response.text
        
        # Parse the response
        lines = text.strip().split('\n')
        result = {
            "material": "Unknown material detected",
            "recyclable": False,
            "confidence": 0.75,
            "recommendations": "Unable to provide specific recommendations. Please consult local waste management guidelines."
        }
        
        for line in lines:
            line = line.strip()
            if line.startswith("Material:"):
                result["material"] = line.replace("Material:", "").strip()
            elif line.startswith("Recyclable:"):
                recyclable_text = line.replace("Recyclable:", "").strip().lower()
                result["recyclable"] = recyclable_text in ["yes", "true", "recyclable"]
            elif line.startswith("Confidence:"):
                confidence_text = line.replace("Confidence:", "").strip().replace("%", "")
                try:
                    result["confidence"] = float(confidence_text) / 100.0
                except:
                    result["confidence"] = 0.75
            elif line.startswith("Recommendations:"):
                result["recommendations"] = line.replace("Recommendations:", "").strip()
        
        return result
        
    except Exception as e:
        raise Exception(f"Classification failed: {str(e)}")


@app.post("/identify")
async def identify_material(image: UploadFile = File(...)) -> Dict[str, Any]:
    """
    POST endpoint for waste material classification.
    
    Args:
        image: Uploaded image file
        
    Returns:
        Dict containing classification results
        
    Raises:
        HTTPException: If processing fails
    """
    if not image:
        raise HTTPException(status_code=400, detail="No image uploaded")
    
    if not image.content_type or not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process the image
        image_data = await image.read()
        pil_image = Image.open(io.BytesIO(image_data))
        
        # Classify the material
        result = classify_waste_material(pil_image)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint to verify API is running."""
    return {
        "status": "healthy",
        "service": "WasteCycle API",
        "model": "gemini-2.5-flash"
    }


# Serve React frontend (only in production when dist folder exists)
if os.path.exists("frontend/dist"):
    # Serve static assets
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse("frontend/dist/index.html")
    
    @app.get("/{path:path}")
    async def serve_frontend_routes(path: str):
        # Skip API routes
        if path.startswith(("health", "identify", "docs", "redoc", "openapi.json")):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        file_path = f"frontend/dist/{path}"
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # For all other routes, serve index.html (SPA routing)
        return FileResponse("frontend/dist/index.html")
else:
    @app.get("/")
    async def root() -> Dict[str, Any]:
        """Root endpoint with API information (development mode)."""
        return {
            "message": "WasteCycle API",
            "version": "1.0.0",
            "model": "gemini-2.5-flash",
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
