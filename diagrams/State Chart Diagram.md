stateDiagram-v2
    [*] --> Idle
    Idle --> Uploading : Upload Image
    Idle --> CameraStarting : Start Camera
    
    Uploading --> Processing : File Valid
    Uploading --> Error : File Invalid
    
    CameraStarting --> CameraReady : Permission Granted
    CameraStarting --> Error : Permission Denied
    
    CameraReady --> Capturing : Capture Button
    CameraReady --> Switching : Switch Camera
    
    Capturing --> Processing : Frame Captured
    Switching --> CameraReady : Camera Switched
    
    Processing --> ShowingResult : Classification Success
    Processing --> Error : Classification Failed
    
    ShowingResult --> Idle : New Classification
    Error --> Idle : Retry
    
    ShowingResult --> [*] : Exit
    Error --> [*] : Exit
