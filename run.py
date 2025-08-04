"""
Startup script for the Waste Material Identification API.

Run this script to start the FastAPI server with uvicorn.
"""

import uvicorn
import os
from dotenv import load_dotenv

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Starting Waste Material Identification API...")
    print(f"📡 Server will run on http://{host}:{port}")
    print(f"📖 API documentation available at http://{host}:{port}/docs")
    print(f"🔍 Health check endpoint: http://{host}:{port}/health")
    
    # Start the server
    uvicorn.run(
        "api:app",
        host=host,
        port=port,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
