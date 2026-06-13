import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = true, 
  delay = 0,
  glow = false,
  glowColor = 'teal' // 'teal' | 'gold' | 'rose'
}) => {
  const glowClasses = {
    teal: 'hover:shadow-glassGlow border-luxuryTeal/20',
    gold: 'hover:shadow-goldGlow border-luxuryGold/20',
    rose: 'hover:shadow-[0_8px_32px_0_rgba(224,168,153,0.15)] border-luxuryRose/20'
  };

  const borderClass = glow ? glowClasses[glowColor] : 'border-white/5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={hoverEffect ? {
        y: -6,
        scale: 1.015,
        rotate: 0.5,
        transition: { duration: 0.3, ease: 'easeOut' }
      } : {}}
      className={`glass-panel rounded-2xl p-6 ${borderClass} shadow-glass ${className}`}
    >
      {children}
    </motion.div>
  );
};
