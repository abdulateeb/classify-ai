/**
 * Centralized error handling and logging utilities
 */

export enum ErrorCategory {
  MODEL_LOADING = 'MODEL_LOADING',
  IMAGE_PROCESSING = 'IMAGE_PROCESSING',
  CLASSIFICATION = 'CLASSIFICATION',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorDetails {
  category: ErrorCategory;
  message: string;
  userMessage: string;
  originalError?: Error;
  timestamp: Date;
  context?: Record<string, any>;
}

class ErrorHandler {
  private errors: ErrorDetails[] = [];
  private maxErrorHistory = 50;

  log(error: ErrorDetails): void {
    this.errors.unshift(error);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrorHistory) {
      this.errors = this.errors.slice(0, this.maxErrorHistory);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${error.category}] ${error.message}`, error.originalError);
    }
  }

  createError(
    category: ErrorCategory,
    message: string,
    userMessage: string,
    originalError?: Error,
    context?: Record<string, any>
  ): ErrorDetails {
    const errorDetails: ErrorDetails = {
      category,
      message,
      userMessage,
      originalError,
      timestamp: new Date(),
      context
    };

    this.log(errorDetails);
    return errorDetails;
  }

  getRecentErrors(count = 10): ErrorDetails[] {
    return this.errors.slice(0, count);
  }

  clearErrors(): void {
    this.errors = [];
  }

  // Specific error creators for common scenarios
  modelLoadingError(originalError: Error): ErrorDetails {
    return this.createError(
      ErrorCategory.MODEL_LOADING,
      `Model loading failed: ${originalError.message}`,
      'Failed to load the AI model. Please refresh the page and try again.',
      originalError
    );
  }

  imageProcessingError(originalError: Error, imageInfo?: Record<string, any>): ErrorDetails {
    return this.createError(
      ErrorCategory.IMAGE_PROCESSING,
      `Image processing failed: ${originalError.message}`,
      'Unable to process the uploaded image. Please try with a different image.',
      originalError,
      imageInfo
    );
  }

  classificationError(originalError: Error): ErrorDetails {
    return this.createError(
      ErrorCategory.CLASSIFICATION,
      `Classification failed: ${originalError.message}`,
      'Classification failed. Please try uploading the image again.',
      originalError
    );
  }

  validationError(message: string, context?: Record<string, any>): ErrorDetails {
    return this.createError(
      ErrorCategory.VALIDATION,
      message,
      message,
      undefined,
      context
    );
  }

  networkError(originalError: Error): ErrorDetails {
    return this.createError(
      ErrorCategory.NETWORK,
      `Network error: ${originalError.message}`,
      'Network connection failed. Please check your internet connection and try again.',
      originalError
    );
  }
}

export const errorHandler = new ErrorHandler();

// Utility function to handle async operations with error catching
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorCategory: ErrorCategory,
  userMessage: string,
  context?: Record<string, any>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const errorDetails = errorHandler.createError(
      errorCategory,
      error instanceof Error ? error.message : 'Unknown error',
      userMessage,
      error instanceof Error ? error : undefined,
      context
    );
    throw new Error(errorDetails.userMessage);
  }
}
