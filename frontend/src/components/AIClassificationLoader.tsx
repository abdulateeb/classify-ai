import { motion } from 'framer-motion';
import { ScanLine, Database, BarChart3 } from 'lucide-react';

interface AIClassificationLoaderProps {
  stage?: 'capturing' | 'analyzing' | 'processing';
}

export function AIClassificationLoader({ stage = 'analyzing' }: AIClassificationLoaderProps) {
  const stageText = {
    capturing: 'Image Acquisition',
    analyzing: 'Material Analysis',
    processing: 'Classification Processing'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="bg-gradient-to-b from-gray-900 to-black border border-green-500/20 rounded-lg p-8 shadow-2xl max-w-md w-full mx-4">
        
        {/* Professional scanning interface */}
        <div className="relative mb-8">
          {/* Main scanning area */}
          <div className="relative w-32 h-32 mx-auto border-2 border-green-500/30 rounded-lg bg-black/40">
            {/* Scanning lines */}
            <motion.div
              className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
              animate={{
                y: [0, 120, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-green-500/10" />
                ))}
              </div>
            </div>
            
            {/* Central analysis indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-8 h-8 border border-green-400 rounded-sm"
                animate={{
                  scale: [1, 1.1, 1],
                  borderColor: ['#4ade80', '#22c55e', '#4ade80'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ScanLine className="w-full h-full text-green-400 p-1" />
              </motion.div>
            </div>
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-green-400" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-green-400" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-green-400" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-green-400" />
        </div>

        {/* Status display */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-mono text-green-400 mb-2 tracking-wider">
            {stageText[stage]}
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono">PROCESSING</span>
          </div>
        </div>

        {/* Progress metrics */}
        <div className="space-y-4 mb-6">
          {[
            { label: "Image Resolution", value: "1920x1080", icon: Database },
            { label: "Analysis Progress", value: "Running...", icon: BarChart3 },
            { label: "Neural Network", value: "Active", icon: ScanLine },
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-black/40 rounded border border-green-500/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center gap-3">
                <metric.icon className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm font-mono">{metric.label}</span>
              </div>
              <span className="text-green-400 text-sm font-mono">{metric.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
            <span>Progress</span>
            <span>Processing...</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 4,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* System status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 font-mono">
          </div>
        </div>
      </div>
    </motion.div>
  );
}
