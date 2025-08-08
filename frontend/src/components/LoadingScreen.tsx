import { motion } from 'framer-motion';
import { Activity, Database, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  stage: 'preprocessing' | 'analyzing' | 'complete';
}

const stages = {
  preprocessing: {
    title: 'Image Preprocessing',
    description: 'Optimizing image parameters',
    icon: Database,
    details: [
      'Resolution analysis',
      'Format validation',
      'Quality enhancement'
    ]
  },
  analyzing: {
    title: 'Material Classification',
    description: 'Neural network processing',
    icon: Activity,
    details: [
      'Deep learning inference',
      'Pattern matching',
      'Confidence calculation'
    ]
  },
  complete: {
    title: 'Analysis Complete',
    description: 'Results compiled',
    icon: CheckCircle,
    details: [
      'Classification verified',
      'Recommendations generated',
      'Report finalized'
    ]
  },
};

export function LoadingScreen({ stage }: LoadingScreenProps) {
  const currentStage = stages[stage];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-50"
    >
      <div className="bg-gradient-to-b from-gray-900 to-black border border-green-500/20 rounded-lg p-8 shadow-2xl max-w-md w-full mx-4">
        
        {/* Professional scanning interface - matching live camera style */}
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
                <currentStage.icon className="w-full h-full text-green-400 p-1" />
              </motion.div>
            </div>
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-green-400" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-green-400" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-green-400" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-green-400" />
        </div>

        {/* Status display - matching live camera style */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-mono text-green-400 mb-2 tracking-wider">
            {currentStage.title}
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono">{currentStage.description.toUpperCase()}</span>
          </div>
        </div>
        
        {/* Progress metrics - matching live camera style */}
        <div className="space-y-4 mb-6">
          {currentStage.details.map((detail, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-black/40 rounded border border-green-500/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center gap-3">
                <currentStage.icon className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm font-mono">{detail}</span>
              </div>
              <motion.div
                className="flex gap-1"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              >
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                <div className="w-1 h-1 bg-green-400 rounded-full" />
                <div className="w-1 h-1 bg-green-400 rounded-full" />
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Progress timeline */}
        <div className="space-y-2">
          {Object.entries(stages).map(([key, value], index) => {
            const isActive = Object.keys(stages).indexOf(stage) >= index;
            const isCurrent = stage === key;
            
            return (
              <div key={key} className="flex items-center gap-3">
                <motion.div 
                  className={`w-2 h-2 rounded-full border ${
                    isActive ? 'bg-green-400 border-green-400' : 'border-gray-600'
                  }`}
                  animate={isCurrent ? {
                    scale: [1, 1.3, 1],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: isCurrent ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                <span className={`text-xs font-mono ${
                  isActive ? 'text-green-400' : 'text-gray-600'
                }`}>
                  {value.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* System info */}
        <div className="mt-6 pt-4 border-t border-green-500/20 text-center">
          <span className="text-xs text-gray-500 font-mono">
            Classification Engine
          </span>
        </div>
      </div>
    </motion.div>
  );
}