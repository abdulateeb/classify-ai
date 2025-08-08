import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 bg-transparent border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-6 text-slate-100">
            Built and Designed by
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Ateeb', 'Zoya'].map((member, index) => (
              <div
                key={member}
                className="relative"
              >
                {/* Animated light effect border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${index * 180}deg, transparent, #22c55e, transparent, #22c55e, transparent)`,
                    padding: '2px',
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5, // Stagger the animation
                  }}
                >
                  <div className="w-full h-full bg-slate-800/90 rounded-full" />
                </motion.div>
                
                {/* Main button */}
                <div className="relative bg-green-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                  <p className="text-white font-medium">{member}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-6">
           All rights reserved. ©
        </p>
      </div>
    </footer>
  );
}