import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Utensils, Apple, Calendar, Scale, Sparkles } from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Flame, color: 'text-luxuryTeal' },
    { id: 'meals', name: 'Meal Library', icon: Utensils, color: 'text-luxuryGold' },
    { id: 'foods', name: 'Food Library', icon: Apple, color: 'text-rose-400' },
    { id: 'planner', name: 'Weekly Planner', icon: Calendar, color: 'text-cyan-400' },
    { id: 'calculator', name: 'Quantity Calc', icon: Scale, color: 'text-luxuryRose' }
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:top-6 md:left-6 md:bottom-auto md:right-auto md:w-64">
      {/* Container with Glassmorphism */}
      <div className="glass-panel backdrop-blur-md rounded-2xl md:h-[calc(100vh-3rem)] p-3 md:p-6 flex md:flex-col justify-between items-center md:items-start border border-white/10 shadow-2xl">
        
        {/* Brand Logo - Top on Desktop, hidden on Mobile */}
        <div className="hidden md:flex items-center space-x-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-luxuryTeal via-cyan-500 to-luxuryGold flex items-center justify-center shadow-[0_0_15px_rgba(100,223,223,0.3)] animate-drift-medium">
            <Sparkles className="w-4.5 h-4.5 text-darkBg" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-white/80 to-luxuryGold bg-clip-text text-transparent">
              AURA
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest leading-none">
              NUTRITION LAB
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex md:flex-col w-full justify-around md:justify-start md:space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center md:space-x-3.5 p-2.5 md:p-3.5 rounded-xl w-full transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/45 hover:text-white/80'
                }`}
              >
                {/* Active Backdrop Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white/[0.06] border border-white/5 rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Left Active Glow Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b from-luxuryTeal to-luxuryGold rounded-r-md hidden md:block" />
                )}

                <Icon className={`w-5 h-5 z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? item.color : 'text-white/60 group-hover:text-white'}`} />
                <span className="hidden md:block text-sm font-medium tracking-wide z-10">
                  {item.name}
                </span>

                {/* Hover Glow Highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.02] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
            );
          })}
        </div>

        {/* Small Tagline at Bottom */}
        <div className="hidden md:block mt-auto px-2">
          <div className="text-[10px] text-white/30 tracking-wider font-light flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow"></span>
            <span>SYSTEM ACTIVE // V1.0.4</span>
          </div>
        </div>

      </div>
    </nav>
  );
};
