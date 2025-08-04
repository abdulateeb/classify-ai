flowchart TD
    Start([Start App]) --> Choice{Upload or Camera?}
    
    Choice -->|Upload| SelectFile[Select Image File]
    Choice -->|Camera| StartCamera[Start Camera]
    
    SelectFile --> ValidateFile{Valid File?}
    ValidateFile -->|Yes| SendToAPI[Send to Gemini API]
    ValidateFile -->|No| Error[Show Error]
    
    StartCamera --> CameraReady[Camera Ready]
    CameraReady --> Capture[Capture Image]
    Capture --> SendToAPI
    
    SendToAPI --> Gemini[Gemini Processing]
    Gemini --> ShowResult[Show Classification Result]
    ShowResult --> End([End])
    
    Error --> Choice
