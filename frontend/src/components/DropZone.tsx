import React from 'react';
import { Upload, Camera, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  /** Called when user wants to open the live camera overlay */
  onStartCamera: () => void;
  isDragging: boolean;
  isLoading: boolean;
}

export function DropZone({ onFileSelect, onStartCamera, isDragging, isLoading }: DropZoneProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  return (
    <motion.div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      className={cn(
        "border-2 border-dashed rounded-2xl p-8 transition-all relative overflow-hidden",
        isDragging ? "border-green-400 bg-green-400/10" : "border-white/20",
        "group hover:border-green-400 hover:bg-green-400/5"
      )}
    >
      {/* Gallery picker */}
      <input
        type="file"
        id="file-upload-gallery"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        accept="image/*"
        disabled={isLoading}
      />


      <div className="text-center relative z-10">
        <motion.div 
          className="flex justify-center mb-6"
          animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        >
          <Image className="w-16 h-16 text-green-400" />
        </motion.div>
        
        <h3 className="text-2xl font-semibold mb-3 text-white">
          {isDragging ? 'Drop image here' : 'Drag and drop image here'}
        </h3>
        
        <p className="text-gray-400 mb-8">
          or select using these options
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            htmlFor="file-upload-gallery"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold cursor-pointer
                     bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg shadow-green-600/30"
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </motion.label>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartCamera}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold cursor-pointer
                     bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <Camera className="w-5 h-5" />
            Live Camera
          </motion.button>
        </div>
      </div>
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </motion.div>
  );
}