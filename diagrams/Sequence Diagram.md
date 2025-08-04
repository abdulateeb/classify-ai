sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Gemini
    
    User->>Frontend: Upload Image
    Frontend->>API: POST /identify
    API->>Gemini: Analyze Image
    Gemini-->>API: Material Type
    API-->>Frontend: Classification Result
    Frontend-->>User: Display Result
