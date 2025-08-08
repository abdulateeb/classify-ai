import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassificationResult } from './ClassificationResult';
import { LiveCamera } from './LiveCamera';
import { DropZone } from './DropZone';
import { LoadingScreen } from './LoadingScreen';
import { classifyImage, type ClassificationResult as ClassificationResultType } from '../lib/classifier';

export default function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'preprocessing' | 'analyzing' | 'complete'>('preprocessing');
  const [result, setResult] = useState<ClassificationResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Function to reset all states for new upload
  const resetUpload = () => {
    setError(null);
    setResult(null);
    setIsLoading(false);
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  // Cleanup effect for preview URLs
  useEffect(() => {
    return () => {
      // Clean up blob URLs when component unmounts
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = async (file: File) => {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    try {
      // Reset all states for new upload
      setError(null);
      setIsLoading(true);
      setLoadingStage('preprocessing');
      setResult(null);
      
      // Clean up previous preview if exists
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      
      // Create object URL for better memory management
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      // Wait until the <img> element is in the DOM and fully loaded
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Image loading timeout - please try a smaller image or different format'));
        }, 15000); // Increased to 15 second timeout

        const waitForImg = () => {
          const imgEl = imageRef.current;
          if (imgEl) {
            if (imgEl.complete && imgEl.naturalHeight !== 0) {
              clearTimeout(timeout);
              resolve();
            } else {
              imgEl.onload = () => {
                clearTimeout(timeout);
                resolve();
              };
              imgEl.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load image - please try a different image'));
              };
            }
          } else {
            requestAnimationFrame(waitForImg);
          }
        };
        waitForImg();
      });

      setLoadingStage('analyzing');
      // Frontend-only deployment: Use classification only
      const classificationResult = await classifyImage(imageRef.current!);
      
      setLoadingStage('complete');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResult(classificationResult);
      
      // Don't clean up object URL here - keep it for display
      // URL.revokeObjectURL(imageUrl);
    } catch (error) {
      // Clean up on error
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null); // Reset preview on error
      setError(error instanceof Error ? error.message : 'An error occurred during classification');
      console.error('Classification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto px-4 py-24" 
      id="upload"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          handleFile(file);
        }
      }}
    >
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="p-8 md:p-12">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Analyze Your Material
              </h2>
              <p className="text-xl text-gray-300">
                Upload or capture an image for instant classification
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                <div className="text-center mb-3">{error}</div>
                <div className="flex justify-center">
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            <DropZone
              onFileSelect={handleFile}
              onStartCamera={() => setIsCameraOpen(true)}
              isDragging={isDragging}
              isLoading={isLoading}
            />

            <AnimatePresence mode="wait">
              {preview && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative aspect-video rounded-2xl overflow-hidden bg-black/50"
                >
                  <img
                    ref={imageRef}
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  {isLoading && <LoadingScreen stage={loadingStage} />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              className="fixed inset-0 bg-gradient-to-br from-green-900/30 via-black/40 to-emerald-900/30 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResult(null)}
            />
            <motion.div className="relative bg-gradient-to-br from-green-950/60 via-black/70 to-emerald-950/60 backdrop-blur-2xl border border-green-400/20 rounded-3xl shadow-2xl shadow-green-500/10 overflow-hidden max-w-2xl w-full mx-4">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
              {/* Close button */}
              <button
                onClick={() => setResult(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ClassificationResult result={result} />
              {/* Analyze Another Image button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setResult(null);
                    resetUpload();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-green-500/25"
                >
                  Analyze Another Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          {isCameraOpen && (
        <LiveCamera onClose={() => setIsCameraOpen(false)} />
      )}
    </motion.div>
  );
}