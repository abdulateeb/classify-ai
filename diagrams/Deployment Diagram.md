graph TB
    subgraph "User Device"
        Browser[Web Browser]
        Camera[Camera]
    end
    
    subgraph "Web Server"
        Frontend[React App]
    end
    
    subgraph "API Server"
        Backend[FastAPI Server]
    end
    
    subgraph "Cloud Service"
        Gemini[Google Gemini AI]
    end
    
    Browser --> Frontend
    Browser --> Camera
    Frontend --> Backend
    Backend --> Gemini
