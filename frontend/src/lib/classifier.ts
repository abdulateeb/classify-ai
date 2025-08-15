import { performanceMonitor } from './performance';
import { ErrorCategory, withErrorHandling } from './errorHandler';

export interface ClassificationResult {
  /** The fine-grained class name predicted by the model */
  material: string;
  /** Model confidence (0-1) */
  confidence: number;
  /** Whether it is recyclable according to simple heuristics */
  recyclable: boolean;
  /** Actionable recycling instructions */
  recommendations: string[];
}

// API endpoint configuration
// Default to Vite proxy path in dev to avoid CORS: '/api'
// Allow override via VITE_API_URL in production deployments
const API_BASE_URL: string = (import.meta as any).env?.VITE_API_URL || '/api';

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

export async function classifyImage(imageElement: HTMLImageElement): Promise<ClassificationResult> {
  performanceMonitor.startTimer('classification');

  try {
    // Convert image to blob for upload
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.8);
    });

    // Create FormData for API request
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');

    // Call the NEW /identify API endpoint
  const response = await fetch(`${API_BASE_URL}/identify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.material) {
      throw new Error('No material identified');
    }

    const classificationTime = performanceMonitor.endTimer('classification');
    console.log(`Classification completed in ${classificationTime.toFixed(2)}ms`);

    // Process the material response and determine recyclability
    const material = result.material.toLowerCase().trim();
    const recyclabilityInfo = determineRecyclability(material);

    return {
      material: result.material,
      confidence: 0.95, // Gemini doesn't return confidence, using high default
      recyclable: recyclabilityInfo.recyclable,
      recommendations: recyclabilityInfo.recommendations,
    };
  } catch (error) {
    performanceMonitor.endTimer('classification');
    console.error('Classification error:', error);
    throw new Error(`Classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Determine recyclability and recommendations based on identified material
 */
function determineRecyclability(material: string): { recyclable: boolean; recommendations: string[] } {
  const materialLower = material.toLowerCase();
  
  // Plastic materials
  if (materialLower.includes('plastic') || materialLower.includes('bottle') || materialLower.includes('container')) {
    return {
      recyclable: true,
      recommendations: [
        'Rinse and dry before recycling',
        'Remove caps and labels if possible',
        'Check local recycling guidelines for plastic type'
      ]
    };
  }
  
  // Glass materials
  if (materialLower.includes('glass') || materialLower.includes('jar')) {
    return {
      recyclable: true,
      recommendations: [
        'Rinse thoroughly to remove residue',
        'Remove metal lids and caps',
        'Separate by color if required locally'
      ]
    };
  }
  
  // Paper materials
  if (materialLower.includes('paper') || materialLower.includes('cardboard') || materialLower.includes('magazine') || materialLower.includes('newspaper')) {
    return {
      recyclable: true,
      recommendations: [
        'Keep dry and clean',
        'Remove plastic windows or tape',
        'Flatten boxes to save space'
      ]
    };
  }
  
  // Metal materials
  if (materialLower.includes('metal') || materialLower.includes('aluminum') || materialLower.includes('steel') || materialLower.includes('can')) {
    return {
      recyclable: true,
      recommendations: [
        'Rinse containers to remove food residue',
        'Remove non-metal parts like plastic lids',
        'Crush cans to save space'
      ]
    };
  }
  
  // Organic/Compostable materials
  if (materialLower.includes('food') || materialLower.includes('organic') || materialLower.includes('compost')) {
    return {
      recyclable: false,
      recommendations: [
        'Compost if possible',
        'Use for garden fertilizer',
        'Dispose in organic waste bin if available'
      ]
    };
  }
  
  // Default case
  return {
    recyclable: false,
    recommendations: [
      'Check local disposal guidelines',
      'Consider if item can be repurposed',
      'Dispose according to local regulations'
    ]
  };
}