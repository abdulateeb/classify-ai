import { motion } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import type { ClassificationResult } from '../lib/classifier';

interface Props {
  result: ClassificationResult;
}

export function ClassificationResult({ result }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 relative mb-4">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
            <Info className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Classification Result
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm text-gray-400 uppercase tracking-wide">Material Type:</span>
              <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                <p className="text-white text-sm leading-relaxed break-words">
                  {result.material}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Confidence</span>
                <span className="font-bold text-white text-lg">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Recyclable</span>
                <div className="flex items-center justify-center mt-1">
                  {result.recyclable ? (
                    <>
                      <Check className="w-5 h-5 text-green-400 mr-1" />
                      <span className="text-green-400 font-semibold text-sm">Yes</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-400 mr-1" />
                      <span className="text-red-400 font-semibold text-sm">No</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3 text-center">
            Recycling Recommendations
          </h3>
          <div className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
              >
                <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">{rec}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}