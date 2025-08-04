import { motion } from 'framer-motion';

interface StatisticCardProps {
  percentage: number;
  label: string;
}

export function StatisticCard({ percentage, label }: StatisticCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
          {percentage}%
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">{label}</p>
      </motion.div>
    </motion.div>
  );
}