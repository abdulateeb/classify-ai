import { Leaf, TrendingUp, Trees, Cpu } from 'lucide-react';

export const impactData = [
  {
    icon: Leaf,
    title: 'Environmental Metrics',
    description: 'Advanced ML classification reduces landfill dependency by 75.3%, decreasing carbon emissions by 2.4M tons annually while preserving 47,000 hectares of biodiversity corridors.',
    theme: {
      gradient: 'from-emerald-500/8 to-green-500/4',
      iconGradient: 'from-emerald-400 to-green-500',
      iconShadow: 'shadow-emerald-500/20',
      borderColor: 'border-emerald-500/15 dark:border-emerald-400/20',
      bgPattern: 'bg-gradient-to-br from-emerald-900/5 to-green-900/3 dark:from-emerald-950/20 dark:to-green-950/10',
      accentColor: 'emerald',
      patternOpacity: 'opacity-[0.03]',
      metricColor: 'text-emerald-400',
      primaryMetric: '75.3%',
      secondaryMetric: '2.4M tons CO₂'
    }
  },
  {
    icon: TrendingUp,
    title: 'Economic Impact',
    description: 'Intelligent material recovery systems generate 10.2x employment multiplier effects, contributing $547B to global circular economy infrastructure with 94% cost efficiency.',
    theme: {
      gradient: 'from-blue-500/8 to-cyan-500/4',
      iconGradient: 'from-blue-400 to-cyan-500',
      iconShadow: 'shadow-blue-500/20',
      borderColor: 'border-blue-500/15 dark:border-blue-400/20',
      bgPattern: 'bg-gradient-to-br from-blue-900/5 to-cyan-900/3 dark:from-blue-950/20 dark:to-cyan-950/10',
      accentColor: 'blue',
      patternOpacity: 'opacity-[0.03]',
      metricColor: 'text-blue-400',
      primaryMetric: '10.2x',
      secondaryMetric: '$547B GDP'
    }
  },
  {
    icon: Trees,
    title: 'Resource Optimization',
    description: 'Precision material recovery preserves 17.4 forest specimens and conserves 7,234 gallons of freshwater per metric ton, achieving 98.7% resource allocation efficiency.',
    theme: {
      gradient: 'from-teal-500/8 to-emerald-500/4',
      iconGradient: 'from-teal-400 to-emerald-500',
      iconShadow: 'shadow-teal-500/20',
      borderColor: 'border-teal-500/15 dark:border-teal-400/20',
      bgPattern: 'bg-gradient-to-br from-teal-900/5 to-emerald-900/3 dark:from-teal-950/20 dark:to-emerald-950/10',
      accentColor: 'teal',
      patternOpacity: 'opacity-[0.03]',
      metricColor: 'text-teal-400',
      primaryMetric: '98.7%',
      secondaryMetric: '7.2K gal/ton'
    }
  },
  {
    icon: Cpu,
    title: 'AI Performance',
    description: 'Next-gen neural networks achieve 99.24% classification accuracy with 847ms average inference time, processing 2.4M materials daily with zero cross-contamination incidents.',
    theme: {
      gradient: 'from-purple-500/8 to-indigo-500/4',
      iconGradient: 'from-purple-400 to-indigo-500',
      iconShadow: 'shadow-purple-500/20',
      borderColor: 'border-purple-500/15 dark:border-purple-400/20',
      bgPattern: 'bg-gradient-to-br from-purple-900/5 to-indigo-900/3 dark:from-purple-950/20 dark:to-indigo-950/10',
      accentColor: 'purple',
      patternOpacity: 'opacity-[0.03]',
      metricColor: 'text-purple-400',
      primaryMetric: '99.24%',
      secondaryMetric: '847ms latency'
    }
  }
];

export const statisticsData = [
  { percentage: 75.3, label: 'Waste Stream Diversion', unit: '%', trend: '+2.1%', status: 'optimal' as const },
  { percentage: 94.7, label: 'Processing Efficiency', unit: '%', trend: '+5.4%', status: 'excellent' as const },
  { percentage: 847, label: 'Avg Inference Time', unit: 'ms', trend: '-12ms', status: 'optimal' as const },
  { percentage: 99.24, label: 'Classification Accuracy', unit: '%', trend: '+0.8%', status: 'excellent' as const }
];