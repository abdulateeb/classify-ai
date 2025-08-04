graph TB
    User[👤 User] --> Upload[📤 Upload Image]
    User --> Camera[📹 Live Camera]
    User --> Switch[🔄 Switch Camera]
    User --> View[📊 View Results]
    
    Admin[� Admin] --> Config[⚙️ Configure API]
    Admin --> Health[📊 Health Check]
    
    Upload --> Gemini[🤖 Google Gemini AI]
    Camera --> Gemini
    View --> Recycling[♻️ Recycling Info]
