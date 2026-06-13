import React from 'react';
import { motion } from 'framer-motion';

export const HorizontalProgressBar = ({ 
  value, 
  max, 
  color = 'teal', // 'teal' | 'gold' | 'rose'
  label, 
  unit = '' 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    teal: 'bg-gradient-to-r from-cyan-400 to-luxuryTeal shadow-[0_0_12px_rgba(100,223,223,0.4)]',
    gold: 'bg-gradient-to-r from-amber-400 to-luxuryGold shadow-[0_0_12px_rgba(229,192,123,0.4)]',
    rose: 'bg-gradient-to-r from-rose-400 to-luxuryRose shadow-[0_0_12px_rgba(224,168,153,0.4)]'
  };

  const textColors = {
    teal: 'text-luxuryTeal',
    gold: 'text-luxuryGold',
    rose: 'text-luxuryRose'
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-white/60 font-medium">{label}</span>
        <span className="font-semibold text-white">
          <span className={textColors[color]}>{value}</span>
          <span className="text-white/40 font-normal"> / {max}{unit}</span>
        </span>
      </div>
      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${colors[color]}`}
        />
      </div>
    </div>
  );
};

export const CircularProgress = ({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 10, 
  color = 'teal',
  label,
  sublabel
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const gradientId = `grad-${color}`;

  const gradients = {
    teal: { from: '#22d3ee', to: '#64DFDF', glow: 'rgba(100, 223, 223, 0.3)' },
    gold: { from: '#fbbf24', to: '#E5C07B', glow: 'rgba(229, 192, 123, 0.3)' },
    rose: { from: '#f43f5e', to: '#E0A899', glow: 'rgba(224, 168, 153, 0.3)' }
  };

  const selectedGrad = gradients[color];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-white/5 fill-transparent"
            strokeWidth={strokeWidth}
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={selectedGrad.from} />
              <stop offset="100%" stopColor={selectedGrad.to} />
            </linearGradient>
          </defs>
          {/* Animated Foreground Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${selectedGrad.glow})`
            }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-white leading-none">
            {Math.round(percentage)}%
          </span>
          {sublabel && (
            <span className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="mt-3 text-sm font-medium text-white/75">{label}</span>
      )}
    </div>
  );
};
