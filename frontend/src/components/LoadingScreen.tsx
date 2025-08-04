import { motion } from 'framer-motion';
import { Loader2, Scan, Check } from 'lucide-react';

interface LoadingScreenProps {
  stage: 'preprocessing' | 'analyzing' | 'complete';
}

const stages = {
  preprocessing: {
    title: 'Preprocessing Image',
    description: 'Optimizing image for analysis...',
    icon: Loader2,
    details: [
      'Resizing image to optimal dimensions',
      'Adjusting color and contrast',
      'Preparing for neural network input'
    ]
  },
  analyzing: {
    title: 'Analyzing Material',
    description: 'Identifying material composition...',
    icon: Scan,
    details: [
      'Running through neural network',
      'Detecting material patterns',
      'Calculating confidence scores'
    ]
  },
  complete: {
    title: 'Analysis Complete',
    description: 'Preparing results...',
    icon: Check,
    details: [
      'Generating recommendations',
      'Formatting results',
      'Preparing display'
    ]
  },
};

export function LoadingScreen({ stage }: LoadingScreenProps) {
  const currentStage = stages[stage];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div className="text-center text-white p-6 max-w-md w-full">
        <motion.div
          animate={{ rotate: stage === 'preprocessing' ? 360 : 0 }}
          transition={{ duration: 1, repeat: stage === 'preprocessing' ? Infinity : 0 }}
          className="mb-4 inline-flex"
        >
          <currentStage.icon className="w-12 h-12" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{currentStage.title}</h3>
        <p className="text-gray-300 mb-4">{currentStage.description}</p>
        
        <div className="bg-black/30 rounded-lg p-4 mb-6">
          <ul className="space-y-2 text-left">
            {currentStage.details.map((detail, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>{detail}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-2">
          {Object.entries(stages).map(([key, value], index) => (
            <div
              key={key}
              className="flex items-center gap-2 text-sm"
            >
              <div className={`w-4 h-4 rounded-full ${
                Object.keys(stages).indexOf(stage) >= index
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              }`} />
              <span className={Object.keys(stages).indexOf(stage) >= index
                ? 'text-white'
                : 'text-gray-400'
              }>{value.title}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}