import { motion } from 'framer-motion';
import { ImpactCard } from './impact/ImpactCard';
import { StatisticCard } from './impact/StatisticCard';
import { impactData, statisticsData } from './impact/impactData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ImpactSection() {
  return (
    <section 
      className="py-24" 
      style={{
        background: 'linear-gradient(135deg, rgb(2, 6, 23) 0%, rgb(15, 23, 42) 35%, rgb(30, 41, 59) 100%)'
      }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 text-white bg-gradient-to-r from-green-400 to-emerald-400 inline-block text-transparent bg-clip-text"
          >
            Impact on Society
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Proper material classification and recycling create lasting positive impacts on our environment, economy, and future generations.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
        >
          {impactData.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ImpactCard {...item} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl transform -rotate-1 shadow-2xl shadow-green-500/20" />
          <div className="relative bg-gradient-to-br from-slate-800 to-gray-800 rounded-2xl p-12 transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-slate-700/50">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-8 text-white">
                Our Impact in Numbers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statisticsData.map((stat, index) => (
                  <StatisticCard key={index} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}