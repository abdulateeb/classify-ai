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
    <section className="py-24 bg-gradient-to-b from-white via-green-50/30 to-white dark:from-gray-900 dark:via-green-900/10 dark:to-gray-900">
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
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white bg-gradient-to-r from-green-600 to-emerald-600 inline-block text-transparent bg-clip-text"
          >
            Impact on Society
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
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
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl transform -rotate-1" />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-12 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
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