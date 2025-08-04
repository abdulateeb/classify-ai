flowchart TD
    User[User] --> Upload[Upload Image]
    User --> Camera[Live Camera]
    
    Upload --> API[FastAPI Server]
    Camera --> API
    
    API --> Gemini[Google Gemini AI]
    Gemini --> Result[Classification Result]
    Result --> User
