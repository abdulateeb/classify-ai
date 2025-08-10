import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ImpactCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  theme?: {
    gradient: string;
    iconGradient: string;
    iconShadow: string;
    borderColor: string;
    bgPattern: string;
    accentColor: string;
    patternOpacity: string;
    metricColor: string;
    primaryMetric: string;
    secondaryMetric: string;
  };
}

export function ImpactCard({ icon: Icon, title, description, theme }: ImpactCardProps) {
  // Grafana-style default theme with precise metrics
  const cardTheme = theme || {
    gradient: 'from-slate-500/8 to-gray-500/4',
    iconGradient: 'from-slate-400 to-gray-500',
    iconShadow: 'shadow-slate-500/20',
    borderColor: 'border-slate-500/15 dark:border-slate-400/20',
    bgPattern: 'bg-gradient-to-br from-slate-900/5 to-gray-900/3 dark:from-slate-950/20 dark:to-gray-950/10',
    accentColor: 'slate',
    patternOpacity: 'opacity-[0.03]',
    metricColor: 'text-slate-400',
    primaryMetric: '98.5%',
    secondaryMetric: 'optimal'
  };

  return (
    <motion.div 
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        rotateX: 2,
        rotateY: -1
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        hover: { duration: 0.2 }
      }}
      className={`
        group relative
        bg-slate-900/40 dark:bg-slate-950/60
        backdrop-blur-xl
        rounded-xl
        border ${cardTheme.borderColor}
        shadow-lg hover:shadow-xl 
        transition-all duration-300 ease-out
        overflow-hidden
        p-6
        h-full
        flex flex-col
        before:absolute before:inset-0 before:rounded-xl 
        before:bg-gradient-to-br before:${cardTheme.gradient}
        before:opacity-50 before:transition-opacity before:duration-300
        hover:before:opacity-70
      `}
      style={{
        transformStyle: 'preserve-3d',
        minHeight: '340px',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
        borderImage: 'linear-gradient(145deg, rgba(71, 85, 105, 0.3), rgba(51, 65, 85, 0.1)) 1',
      }}
    >
      {/* Grafana-style grid pattern */}
      <div className={`absolute inset-0 ${cardTheme.patternOpacity}`}>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(71, 85, 105, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(71, 85, 105, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
          }}
        />
        {/* Data visualization accent lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
      </div>
      
      {/* Content container - Grafana dashboard style */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header section with metrics */}
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className={`
              relative w-12 h-12
              rounded-lg 
              bg-gradient-to-br ${cardTheme.iconGradient}
              ${cardTheme.iconShadow} shadow-lg
              flex items-center justify-center
              border border-white/10
            `}
            whileHover={{ 
              scale: 1.05,
              y: -1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400,
              damping: 25
            }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          {/* Primary metric display - Grafana style */}
          <div className="text-right">
            <div className={`text-2xl font-mono font-bold ${cardTheme.metricColor} tracking-tight`}>
              {cardTheme.primaryMetric}
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {cardTheme.secondaryMetric}
            </div>
          </div>
        </div>

        {/* Title and description */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-3 text-slate-100 tracking-tight leading-tight">
            {title}
          </h3>
          
          <p className="text-slate-300 leading-relaxed text-sm font-normal tracking-wide">
            {description}
          </p>
        </div>

        {/* Bottom status bar - Grafana style */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cardTheme.iconGradient}`} />
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                ACTIVE
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grafana-style corner accents */}
      <div className={`absolute top-2 left-2 w-4 h-4 border-l border-t border-${cardTheme.accentColor}-400/40`} />
      <div className={`absolute top-2 right-2 w-4 h-4 border-r border-t border-${cardTheme.accentColor}-400/40`} />
      <div className={`absolute bottom-2 left-2 w-4 h-4 border-l border-b border-${cardTheme.accentColor}-400/40`} />
      <div className={`absolute bottom-2 right-2 w-4 h-4 border-r border-b border-${cardTheme.accentColor}-400/40`} />

      {/* Hover glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${cardTheme.iconGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />
    </motion.div>
  );
}