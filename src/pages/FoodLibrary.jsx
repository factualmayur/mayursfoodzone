import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { foodLibrary } from '../data/foodLibrary';
import { GlassCard } from '../components/GlassCard';
import { 
  Apple, 
  Flame, 
  Dumbbell, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Activity,
  Droplet,
  Compass
} from 'lucide-react';

export const FoodLibrary = () => {
  const [activeTab, setActiveTab] = useState('proteins');

  const tabs = [
    { id: 'proteins', label: 'Protein Sources', icon: Dumbbell, color: 'text-luxuryGold' },
    { id: 'carbs', label: 'Carb Sources', icon: Flame, color: 'text-rose-400' },
    { id: 'veggies', label: 'Vegetable System', icon: Activity, color: 'text-emerald-400' },
    { id: 'fruits', label: 'Fruit Library', icon: Apple, color: 'text-cyan-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 md:pt-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-1">
          <Compass className="w-5 h-5 text-rose-400" />
          <span className="text-xs text-rose-400 font-semibold uppercase tracking-widest font-mono">
            Aesthetic Database
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Food Library
        </h2>
        <p className="text-sm text-white/50">
          Raw ingredients data, cost evaluation, and biomechanic timings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8 border-b border-white/5 pb-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl border text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-white/5 border-white/10 text-white shadow-lg'
                  : 'bg-transparent border-transparent text-white/45 hover:text-white/75'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? tab.color : 'text-white/35'}`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* PROTEIN SOURCES */}
          {activeTab === 'proteins' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodLibrary.proteins.map((food, idx) => (
                <GlassCard key={food.name} delay={idx * 0.04} className="border hover:border-luxuryGold/10 p-0! overflow-hidden flex flex-col sm:flex-row h-full" hoverEffect={true}>
                  
                  {/* Food Image */}
                  <div className="w-full sm:w-[130px] h-32 sm:h-full min-h-[120px] relative overflow-hidden shrink-0">
                    <img 
                      src={food.image} 
                      alt={food.name} 
                      className="w-full h-full object-cover filter brightness-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-darkBg via-darkBg/10 to-transparent" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-base font-bold text-white tracking-tight leading-tight">{food.name}</h3>
                          <span className="text-[10px] text-white/40 font-mono">Serving: {food.servingSize}</span>
                        </div>
                        
                        {/* Protein indicator badge */}
                        <div className="bg-luxuryGold/10 border border-luxuryGold/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-luxuryGold shrink-0 ml-2">
                          {food.protein} Pro
                        </div>
                      </div>

                      <div className="space-y-2 text-[11px] mb-2">
                        {/* Cost rating */}
                        <div className="flex items-center space-x-2 text-white/60">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Cost Profile: <span className="font-semibold text-white">{food.cost}</span></span>
                        </div>
                        {/* Calories */}
                        <div className="flex items-center space-x-2 text-white/60">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span>Caloric Value: <span className="font-semibold text-white">~{food.calories} kcal</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Best Use */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 mt-2">
                      <span className="text-[9px] text-luxuryGold font-mono uppercase tracking-wider block mb-0.5">Optimal Intake:</span>
                      <p className="text-white/70 leading-relaxed font-light text-[10.5px]">{food.bestUse}</p>
                    </div>
                  </div>

                </GlassCard>
              ))}
            </div>
          )}

          {/* CARB SOURCES */}
          {activeTab === 'carbs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodLibrary.carbs.map((food, idx) => (
                <GlassCard key={food.name} delay={idx * 0.04} className="border hover:border-rose-400/10 p-0! overflow-hidden flex flex-col sm:flex-row h-full" hoverEffect={true}>
                  
                  {/* Food Image */}
                  <div className="w-full sm:w-[130px] h-32 sm:h-full min-h-[120px] relative overflow-hidden shrink-0">
                    <img 
                      src={food.image} 
                      alt={food.name} 
                      className="w-full h-full object-cover filter brightness-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-darkBg via-darkBg/10 to-transparent" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-base font-bold text-white tracking-tight leading-tight">{food.name}</h3>
                          <span className="text-[10px] text-white/40 font-mono">Quantity: {food.quantity}</span>
                        </div>
                        
                        {/* Calorie badge */}
                        <div className="bg-rose-400/10 border border-rose-400/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-rose-400 shrink-0 ml-2">
                          {food.calories}
                        </div>
                      </div>

                      <div className="space-y-2 text-[11px] mb-2">
                        {/* Carbs breakdown */}
                        <div className="flex items-center space-x-2 text-white/60">
                          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Carb Payload: <span className="font-semibold text-white">{food.carbs}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Best Time */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 mt-2">
                      <span className="text-[9px] text-rose-400 font-mono uppercase tracking-wider block mb-0.5">Ideal Timing:</span>
                      <p className="text-white/70 leading-relaxed font-light text-[10.5px]">{food.bestTime}</p>
                    </div>
                  </div>

                </GlassCard>
              ))}
            </div>
          )}

          {/* VEGETABLE SYSTEM */}
          {activeTab === 'veggies' && (
            <div className="space-y-8">
              
              {/* Spinach Alert Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 rounded-2xl p-5 flex items-center space-x-4 shadow-[0_8px_32px_0_rgba(16,185,129,0.05)]">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-400">Spinach Day Frequency</h4>
                  <p className="text-xs text-white/75 leading-relaxed mt-0.5">
                    Integrate spinach <span className="text-emerald-400 font-bold underline font-mono">{foodLibrary.vegetables.spinachFrequency.split('.')[0]}</span> to replenish iron, magnesium, and trigger muscle vascularity.
                  </p>
                </div>
              </div>

              {/* Three Main Subcategories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Meal Veggies */}
                <GlassCard className="border-emerald-500/10" delay={0.05}>
                  <h3 className="text-md font-bold text-white mb-4 border-b border-white/5 pb-2 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Meal Veggies</span>
                  </h3>
                  <div className="space-y-4">
                    {foodLibrary.vegetables.mealVeggies.map((veg) => (
                      <div key={veg.name} className="text-xs bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <span className="font-bold text-white block mb-0.5">{veg.name}</span>
                        <span className="text-white/50 font-light leading-relaxed">{veg.benefit}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Juice System */}
                <GlassCard className="border-emerald-500/10" delay={0.1}>
                  <h3 className="text-md font-bold text-white mb-4 border-b border-white/5 pb-2 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Juice Veggies (Morning)</span>
                  </h3>
                  <div className="space-y-4">
                    {foodLibrary.vegetables.juices.map((veg) => (
                      <div key={veg.name} className="text-xs bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <span className="font-bold text-white block mb-0.5">{veg.name}</span>
                        <span className="text-white/50 font-light leading-relaxed">{veg.benefit}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Salad System */}
                <GlassCard className="border-emerald-500/10" delay={0.15}>
                  <h3 className="text-md font-bold text-white mb-4 border-b border-white/5 pb-2 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    <span>Salad Veggies (Raw)</span>
                  </h3>
                  <div className="space-y-4">
                    {foodLibrary.vegetables.salads.map((veg) => (
                      <div key={veg.name} className="text-xs bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <span className="font-bold text-white block mb-0.5">{veg.name}</span>
                        <span className="text-white/50 font-light leading-relaxed">{veg.benefit}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

              </div>
            </div>
          )}

          {/* FRUIT LIBRARY */}
          {activeTab === 'fruits' && (
            <div className="space-y-6">
              {foodLibrary.fruits.map((fruit, idx) => (
                <GlassCard key={fruit.name} delay={idx * 0.05} className="border hover:border-cyan-400/10" hoverEffect={true}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <Apple className="w-5.5 h-5.5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{fruit.name}</h3>
                        <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-mono mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Ideal: {fruit.timing}</span>
                        </div>
                      </div>
                    </div>

                    {/* Benefit summary */}
                    <div className="md:max-w-md bg-white/[0.02] border border-white/5 rounded-xl p-3.5 text-xs leading-relaxed text-white/70 font-light">
                      <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block mb-1">Metabolic Payoffs:</span>
                      {fruit.benefit}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
