/**
 * Performance monitoring utilities for the WasteCycle application
 */

interface PerformanceMetrics {
  modelLoadTime?: number;
  classificationTime?: number;
  imageProcessingTime?: number;
  totalMemoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private timers: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (startTime === undefined) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.timers.delete(name);
    
    // Store metrics
    switch (name) {
      case 'modelLoad':
        this.metrics.modelLoadTime = duration;
        break;
      case 'classification':
        this.metrics.classificationTime = duration;
        break;
      case 'imageProcessing':
        this.metrics.imageProcessingTime = duration;
        break;
    }
    
    return duration;
  }

  getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    return 0;
  }

  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.table(this.metrics);
      console.log(`Memory usage: ${this.getMemoryUsage().toFixed(2)} MB`);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics, totalMemoryUsage: this.getMemoryUsage() };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Memory cleanup utilities
export function scheduleGarbageCollection(): void {
  // Force garbage collection in development
  if (process.env.NODE_ENV === 'development' && 'gc' in window) {
    (window as any).gc();
  }
}

export function trackImageMemory(): () => void {
  const startMemory = performanceMonitor.getMemoryUsage();
  
  return () => {
    const endMemory = performanceMonitor.getMemoryUsage();
    const memoryDiff = endMemory - startMemory;
    
    if (memoryDiff > 10) { // More than 10MB increase
      console.warn(`High memory usage detected: ${memoryDiff.toFixed(2)} MB`);
    }
  };
}
