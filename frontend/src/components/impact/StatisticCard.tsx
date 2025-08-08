import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatisticCardProps {
  percentage: number;
  label: string;
  unit?: string;
  trend?: string;
  status?: 'optimal' | 'excellent' | 'warning' | 'critical';
}

export function StatisticCard({ percentage, label, unit = '%', trend, status = 'optimal' }: StatisticCardProps) {
  const statusColors = {
    optimal: 'from-blue-400 to-cyan-400',
    excellent: 'from-green-400 to-emerald-400',
    warning: 'from-yellow-400 to-orange-400',
    critical: 'from-red-400 to-pink-400'
  };

  const statusBg = {
    optimal: 'bg-blue-500/10 border-blue-500/20',
    excellent: 'bg-green-500/10 border-green-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    critical: 'bg-red-500/10 border-red-500/20'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    const isPositive = trend.includes('+');
    const isNegative = trend.includes('-');
    
    if (isPositive) return <TrendingUp className="w-3 h-3" />;
    if (isNegative) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400';
    const isPositive = trend.includes('+');
    const isNegative = trend.includes('-');
    
    // For metrics like latency, negative is good (lower is better)
    if (label.includes('Time') || label.includes('Latency')) {
      return isNegative ? 'text-green-400' : isPositive ? 'text-yellow-400' : 'text-slate-400';
    }
    
    // For most metrics, positive is good
    return isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        relative p-6 rounded-xl 
        ${statusBg[status]}
        backdrop-blur-xl
        border
        shadow-lg hover:shadow-xl
        transition-all duration-300
        overflow-hidden
      `}
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))',
      }}
    >
      {/* Grafana-style grid background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(71, 85, 105, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(71, 85, 105, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '12px 12px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        {/* Status indicator */}
        <div className="flex justify-between items-start mb-3">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${statusColors[status]}`} />
          {trend && (
            <div className={`flex items-center space-x-1 text-xs font-mono ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trend}</span>
            </div>
          )}
        </div>

        {/* Main metric */}
        <div className="mb-2">
          <span className={`text-4xl font-mono font-bold bg-gradient-to-r ${statusColors[status]} text-transparent bg-clip-text`}>
            {percentage}
          </span>
          <span className="text-lg font-mono text-slate-400 ml-1">
            {unit}
          </span>
        </div>

        {/* Label */}
        <p className="text-slate-300 font-medium text-sm uppercase tracking-wider">
          {label}
        </p>

        {/* Status text */}
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <span className={`text-xs font-medium uppercase tracking-wider bg-gradient-to-r ${statusColors[status]} text-transparent bg-clip-text`}>
            {status}
          </span>
        </div>
      </motion.div>

      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${statusColors[status]} opacity-0 hover:opacity-5 transition-opacity duration-300`} />
    </motion.div>
  );
}