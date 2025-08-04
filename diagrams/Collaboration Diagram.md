graph LR
    User([User]) -->|1: upload| ImageUpload[ImageUpload]
    User -->|1: camera| LiveCamera[LiveCamera]
    
    ImageUpload -->|2: classify| WasteClassifier[WasteClassifier]
    LiveCamera -->|2: classify| WasteClassifier
    
    WasteClassifier -->|3: API call| FastAPI[FastAPI]
    FastAPI -->|4: analyze| Gemini[Gemini AI]
    
    Gemini -->|5: result| FastAPI
    FastAPI -->|6: response| WasteClassifier
    WasteClassifier -->|7: display| User
