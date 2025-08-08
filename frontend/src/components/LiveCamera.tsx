import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw } from 'lucide-react';
import { classifyImage, type ClassificationResult as ClassificationResultType } from '../lib/classifier';
import { ClassificationResult } from './ClassificationResult';

interface LiveCameraProps {
  onClose: () => void;
}

/**
 * Displays a fullscreen overlay that streams the user's camera and allows capturing images
 * for classification using the Gemini API.
 */
export function LiveCamera({ onClose }: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [classification, setClassification] = useState<ClassificationResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // 'user' = front, 'environment' = rear

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        setError(null);
        setCameraStarted(false);
        
        // Stop existing stream if any
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Request camera permission with current facing mode
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Wait for video to be ready
          await new Promise<void>((resolve) => {
            const video = videoRef.current!;
            const onLoadedMetadata = () => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              resolve();
            };
            video.addEventListener('loadedmetadata', onLoadedMetadata);
          });
          
          await videoRef.current.play();
          setCameraStarted(true);
        }
      } catch (err) {
        console.error('Camera access error:', err);
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera permissions and refresh.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device.');
          } else {
            setError('Unable to access camera. Please check your camera settings.');
          }
        } else {
          setError('Camera access failed.');
        }
      }
    };

    startCamera();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]); // Re-run when facingMode changes

  // Cleanup stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Capture and classify image
  const captureImage = useCallback(async () => {
    if (!videoRef.current || !cameraStarted || isCapturing) return;

    setIsCapturing(true);
    setError(null);
    setClassification(null);

    try {
      const video = videoRef.current;
      
      // Create canvas for capturing frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Unable to get canvas context');
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to image element for classification
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load captured image'));
        img.src = imageDataUrl;
      });

      // Classify the captured image
      const result = await classifyImage(img);
      setClassification(result);
      
    } catch (err) {
      console.error('Capture/classification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to capture and classify image');
    } finally {
      setIsCapturing(false);
    }
  }, [cameraStarted, isCapturing]);

  // Switch camera facing mode
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setClassification(null); // Clear previous classification
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-full h-full max-w-4xl flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 text-white">
            <h2 className="text-xl font-semibold">Live Camera</h2>
            <div className="flex items-center gap-2">
              {/* Camera switch button */}
              <button
                onClick={switchCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label={`Switch to ${facingMode === 'user' ? 'rear' : 'front'} camera`}
                title={`Switch to ${facingMode === 'user' ? 'rear' : 'front'} camera`}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label="Close camera"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video container */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl">
              
              {/* Video stream */}
              <video 
                ref={videoRef} 
                className="w-full h-auto rounded-lg bg-black" 
                muted 
                playsInline
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }} // Mirror only for front camera
              />

              {/* Camera not started overlay */}
              {!cameraStarted && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white rounded-lg">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                    <p>Starting {facingMode === 'user' ? 'front' : 'rear'} camera...</p>
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-white rounded-lg">
                  <div className="text-center p-4">
                    <X className="w-12 h-12 mx-auto mb-2 text-red-400" />
                    <p className="text-red-400 font-semibold mb-2">Camera Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}


            </div>
          </div>

          {/* Capture button */}
          {cameraStarted && !error && (
            <div className="p-4 flex justify-center">
              <button
                onClick={captureImage}
                disabled={isCapturing}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-full w-16 h-16 flex items-center justify-center transition-colors shadow-lg"
                aria-label="Capture image"
              >
                {isCapturing ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-8 h-8" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Classification Result Modal - Same style as ImageUpload */}
        <AnimatePresence>
          {classification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-60 px-4"
            >
              <motion.div
                className="fixed inset-0 bg-gradient-to-br from-green-900/30 via-black/40 to-emerald-900/30 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setClassification(null)}
              />
              <motion.div className="relative bg-gradient-to-br from-green-950/60 via-black/70 to-emerald-950/60 backdrop-blur-2xl border border-green-400/20 rounded-3xl shadow-2xl shadow-green-500/10 overflow-hidden max-w-2xl w-full mx-4">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
                {/* Close button */}
                <button
                  onClick={() => setClassification(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <ClassificationResult result={classification} />
                {/* Capture Another Image button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => setClassification(null)}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-green-500/25"
                  >
                    Capture Another Image
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
