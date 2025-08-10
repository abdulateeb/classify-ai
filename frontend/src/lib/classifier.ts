import { performanceMonitor } from './performance';
import { ErrorCategory, withErrorHandling } from './errorHandler';

export interface ClassificationResult {
  /** The identified material type */
  material: string;
  /** Model confidence (0-1) */
  confidence: number;
  /** Whether it is recyclable */
  recyclable: boolean;
  /** Recycling and disposal recommendations */
  recommendations: string | string[];
}

// API endpoint configuration - use relative URL for same-domain deployment
const API_BASE_URL = '';

export async function loadModel() {
  // No longer need to load a local model since we're using Gemini API
  return withErrorHandling(
    async () => {
      performanceMonitor.startTimer('modelLoad');
      
      console.log('Checking API connection...');
      
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
          throw new Error(`API health check failed: ${response.status}`);
        }
        const healthData = await response.json();
        console.log('API connection successful:', healthData);
      } catch (error) {
        console.error('API connection failed:', error);
        throw new Error('Unable to connect to classification API');
      }
      
      const loadTime = performanceMonitor.endTimer('modelLoad');
      console.log(`API connection verified in ${loadTime.toFixed(2)}ms`);
    },
    ErrorCategory.MODEL_LOADING,
    'Failed to connect to the AI service. Please check your internet connection and try again.'
  );
}

export async function classifyImage(imageFile: File): Promise<ClassificationResult> {
  performanceMonitor.startTimer('classification');

  try {
    // Create FormData for API request
    const formData = new FormData();
    formData.append('image', imageFile);

    // Call the /identify API endpoint
    const response = await fetch(`${API_BASE_URL}/identify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.material) {
      throw new Error('No material identified');
    }

    const classificationTime = performanceMonitor.endTimer('classification');
    console.log(`Classification completed in ${classificationTime.toFixed(2)}ms`);

    return {
      material: result.material,
      confidence: result.confidence || 0.75,
      recyclable: result.recyclable || false,
      recommendations: result.recommendations || 'No specific recommendations available',
    };
  } catch (error) {
    performanceMonitor.endTimer('classification');
    console.error('Classification error:', error);
    throw new Error(`Classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  
  return response.json();
}