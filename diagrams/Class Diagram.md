classDiagram
    class App {
        +render()
        +toggleTheme()
    }
    
    class ImageUpload {
        +handleFileSelect()
        +uploadImage()
    }
    
    class LiveCamera {
        +startCamera()
        +captureImage()
        +switchCamera()
    }
    
    class WasteClassifier {
        +classifyImage()
        +callAPI()
    }
    
    class FastAPIServer {
        +identify_endpoint()
        +health_check()
    }
    
    class GeminiAPI {
        +generate_content()
        +identify_material()
    }
    
    App --> ImageUpload
    App --> LiveCamera
    ImageUpload --> WasteClassifier
    LiveCamera --> WasteClassifier
    WasteClassifier --> FastAPIServer
    FastAPIServer --> GeminiAPI
