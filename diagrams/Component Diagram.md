graph TB
    subgraph "Frontend"
        App[App]
        ImageUpload[ImageUpload]
        LiveCamera[LiveCamera]
        Classifier[WasteClassifier]
    end
    
    subgraph "Backend"
        API[FastAPI Server]
        GeminiService[Gemini Service]
    end
    
    subgraph "External"
        Gemini[Google Gemini AI]
    end
    
    App --> ImageUpload
    App --> LiveCamera
    ImageUpload --> Classifier
    LiveCamera --> Classifier
    Classifier --> API
    API --> GeminiService
    GeminiService --> Gemini
