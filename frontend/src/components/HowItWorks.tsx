import { motion } from 'framer-motion';
import { Upload, Camera, Search, Recycle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Image',
    description: 'Upload an image of the waste you want to classify',
  },
  {
    icon: Camera,
    title: 'Open Camera',
    description: 'Or use your camera to capture the waste directly',
  },
  {
    icon: Search,
    title: 'AI Analysis',
    description: 'Our AI model analyzes the waste material',
  },
  {
    icon: Recycle,
    title: 'Get Results',
    description: 'Receive what type of waste material it is along with recycling recommendations',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                    <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}