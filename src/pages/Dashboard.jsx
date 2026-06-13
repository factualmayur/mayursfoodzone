import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { CircularProgress, HorizontalProgressBar } from '../components/ProgressBar';
import { 
  Plus, 
  Trash2, 
  Coffee, 
  Dumbbell, 
  TrendingUp, 
  Droplet, 
  Apple as AppleIcon, 
  Check, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export const Dashboard = ({ setActiveTab }) => {
  const {
    targets,
    proteinChecklist,
    preWorkout,
    postWorkout,
    waterIntake,
    fruitIntake,
    currentProtein,
    currentCarbs,
    currentCalories,
    toggleProteinChecklist,
    addCustomProteinItem,
    deleteProteinItem,
    togglePreWorkout,
    setPostWorkout,
    adjustWater,
    adjustFruit
  } = useContext(AppContext);

  const [customName, setCustomName] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (customName && customProtein) {
      addCustomProteinItem(customName, customProtein);
      setCustomName('');
      setCustomProtein('');
      setIsAddingCustom(false);
    }
  };

  const navCards = [
    { id: 'meals', title: 'Meal Library', desc: 'Curated premium recipes', color: 'text-luxuryGold', border: 'hover:border-luxuryGold/30' },
    { id: 'foods', title: 'Food Library', desc: 'Nutrient & cost database', color: 'text-rose-400', border: 'hover:border-rose-400/30' },
    { id: 'planner', title: 'Weekly Planner', desc: 'Monday to Sunday plan', color: 'text-cyan-400', border: 'hover:border-cyan-400/30' },
    { id: 'calculator', title: 'Quantity Calc', desc: 'Smart kitchen measures', color: 'text-luxuryRose', border: 'hover:border-luxuryRose/30' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 md:pt-8"
    >
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/80 to-luxuryGold bg-clip-text text-transparent">
            Today's Dashboard
          </h2>
          <p className="text-sm text-white/50">
            Aesthetic bio-metrics & nutrition logging.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs glass-panel px-4 py-2 rounded-full border-white/5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow"></span>
          <span className="text-white/60 tracking-wider font-mono">CALORIES LOADED: {currentCalories} kcal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: DAILY TARGETS & WORKOUTS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Daily Targets Card */}
          <GlassCard glow glowColor="teal" delay={0.05}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-luxuryTeal" />
                <h3 className="font-semibold text-lg text-white">Daily Targets</h3>
              </div>
              <span className="text-xs text-white/40 tracking-wider">REALTIME METRICS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              
              {/* Circular Progress: Protein */}
              <div className="flex justify-center sm:col-span-1 py-4 border-r border-white/5 sm:pr-6">
                <CircularProgress 
                  value={currentProtein} 
                  max={targets.protein} 
                  color="gold" 
                  size={135}
                  label="Protein Intake"
                  sublabel={`${Math.round(currentProtein)}g / ${targets.protein}g`}
                />
              </div>

              {/* Horizontal Progress Bars (Calories & Carbs) */}
              <div className="sm:col-span-2 space-y-5">
                <HorizontalProgressBar 
                  value={currentCalories} 
                  max={targets.calories} 
                  color="teal" 
                  label="Daily Calories" 
                  unit=" kcal"
                />
                
                <HorizontalProgressBar 
                  value={currentCarbs} 
                  max={targets.carbs} 
                  color="rose" 
                  label="Carbohydrates" 
                  unit="g"
                />

                <div className="flex justify-between items-center text-[10px] text-white/40 pt-2 font-mono">
                  <span>METABOLIC STATUS: OPTIMAL</span>
                  <span>FAT PROFILE: EST. 52g</span>
                </div>
              </div>

            </div>
          </GlassCard>

          {/* Pre & Post Workout Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pre Workout */}
            <GlassCard delay={0.1}>
              <div className="flex items-center space-x-2 mb-4">
                <Coffee className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Pre Workout</h3>
              </div>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">
                Select your preferred clean energy source to fuel your training session.
              </p>
              
              <div className="flex flex-col space-y-2">
                {['Banana', 'Coffee', 'Sweet Potato'].map((item) => {
                  const isActive = preWorkout.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => togglePreWorkout(item)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
                        isActive 
                          ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.08)]' 
                          : 'border-white/5 hover:border-white/10 text-white/60'
                      }`}
                    >
                      <span className="font-medium">{item}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isActive ? 'bg-amber-400 border-amber-400' : 'border-white/20'
                      }`}>
                        {isActive && <Check className="w-3.5 h-3.5 text-darkBg stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Post Workout */}
            <GlassCard delay={0.15} glow={postWorkout} glowColor="rose">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="w-5 h-5 text-luxuryRose" />
                  <h3 className="font-semibold text-white">Post Workout</h3>
                </div>
                <span className="text-[10px] text-luxuryRose bg-luxuryRose/10 px-2 py-0.5 rounded font-mono">
                  +26g PROTEIN
                </span>
              </div>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">
                Check to log your recovery shake and instantly feed your muscles.
              </p>

              <button
                onClick={() => setPostWorkout(!postWorkout)}
                className={`w-full group relative flex flex-col items-center justify-center p-5 rounded-xl border text-center transition-all duration-500 overflow-hidden ${
                  postWorkout 
                    ? 'bg-luxuryRose/10 border-luxuryRose/40 shadow-[0_0_20px_rgba(224,168,153,0.1)]' 
                    : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-500 ${
                  postWorkout ? 'bg-luxuryRose text-darkBg rotate-12' : 'bg-white/5 text-white/40 group-hover:scale-110'
                }`}>
                  <Zap className="w-5 h-5 stroke-[2.5]" />
                </div>
                
                <span className={`font-semibold text-sm ${postWorkout ? 'text-white' : 'text-white/60'}`}>
                  {postWorkout ? 'Recovery Shake Logged ✓' : 'Log Recovery Shake'}
                </span>
                <span className="text-[10px] text-white/40 mt-1">
                  {postWorkout ? 'Consuming 26g whey protein isolate' : 'Not logged today'}
                </span>
              </button>
            </GlassCard>

          </div>

        </div>

        {/* RIGHT COLUMN: PROTEIN LOGS, WATER & FRUIT (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Protein Checklist Card */}
          <GlassCard delay={0.2} className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <h3 className="font-semibold text-white text-lg">Protein Consumed</h3>
                <span className="text-xs text-white/40">Check boxes to log foods</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/40">Current Intake</span>
                <div className="text-xl font-bold text-luxuryGold glow-text-gold">{Math.round(currentProtein)}g <span className="text-sm font-normal text-white/30">/ {targets.protein}g</span></div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
              {proteinChecklist.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                    item.checked 
                      ? 'bg-white/[0.03] border-white/10' 
                      : 'border-white/5 bg-transparent'
                  }`}
                >
                  <button
                    onClick={() => toggleProteinChecklist(item.id)}
                    className="flex items-center space-x-3.5 text-left flex-1"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      item.checked ? 'bg-luxuryGold border-luxuryGold' : 'border-white/20'
                    }`}>
                      {item.checked && <Check className="w-3.5 h-3.5 text-darkBg stroke-[3]" />}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${item.checked ? 'text-white' : 'text-white/45 line-through'}`}>
                        {item.name}
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">+{item.protein}g Protein</span>
                    </div>
                  </button>

                  {/* Delete Button for custom items */}
                  {item.name.includes('(Custom)') && (
                    <button
                      onClick={() => deleteProteinItem(item.id)}
                      className="text-white/30 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Item Adder Toggle */}
            <div className="mt-4 pt-4 border-t border-white/5">
              {!isAddingCustom ? (
                <button
                  onClick={() => setIsAddingCustom(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-white/25 hover:bg-white/[0.01] transition-all text-xs font-semibold text-white/60 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Protein Log</span>
                </button>
              ) : (
                <form onSubmit={handleAddCustom} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Food item name"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-luxuryGold/40"
                    />
                    <input
                      type="number"
                      placeholder="Protein (grams)"
                      required
                      min="1"
                      max="100"
                      value={customProtein}
                      onChange={(e) => setCustomProtein(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-luxuryGold/40"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-luxuryGold hover:bg-amber-500 text-darkBg text-xs font-bold py-2 rounded-xl transition-all"
                    >
                      Save Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustom(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </GlassCard>

          {/* Water & Fruit Trackers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Water Tracker */}
            <GlassCard delay={0.25} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Droplet className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">Water Intake</h3>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-extrabold text-cyan-400 glow-text-teal">{(waterIntake / 1000).toFixed(2)}L</span>
                  <span className="text-xs text-white/30 ml-1">/ {(targets.water / 1000)}L Target</span>
                </div>
              </div>

              {/* Simulated glass container wave */}
              <div className="h-16 w-full bg-white/5 rounded-xl border border-white/5 relative overflow-hidden mb-4 p-[1px]">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(waterIntake / targets.water) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-gradient-to-t from-cyan-500/30 via-cyan-400/40 to-cyan-300/50 absolute bottom-0 left-0 right-0 rounded-b-xl border-t border-cyan-400/40 flex items-center justify-center"
                >
                  <span className="text-[10px] font-mono text-cyan-300 font-bold tracking-widest">
                    {Math.round((waterIntake / targets.water) * 100)}%
                  </span>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => adjustWater(250)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl py-2 text-xs font-semibold text-white transition-all flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>250ml</span>
                </button>
                <button
                  onClick={() => adjustWater(500)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl py-2 text-xs font-semibold text-white transition-all flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>500ml</span>
                </button>
              </div>
            </GlassCard>

            {/* Fruit Tracker */}
            <GlassCard delay={0.3} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AppleIcon className="w-5 h-5 text-rose-400" />
                  <h3 className="font-semibold text-white">Fruit Intake</h3>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-extrabold text-rose-400 glow-text-rose">{fruitIntake}</span>
                  <span className="text-xs text-white/30 ml-1">/ 2 servings Target</span>
                </div>
              </div>

              {/* Serving Indicator segments */}
              <div className="flex space-x-2.5 mb-5 mt-2">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-12 flex-1 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      fruitIntake >= s
                        ? 'bg-rose-400/10 border-rose-400/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.06)]'
                        : 'border-white/5 bg-white/[0.01] text-white/20'
                    }`}
                  >
                    {fruitIntake >= s ? (
                      <AppleIcon className="w-5 h-5 animate-drift-slow" />
                    ) : (
                      <span className="text-xs font-bold font-mono">S{s}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => adjustFruit(1)}
                  disabled={fruitIntake >= 5}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/5 hover:border-white/10 rounded-xl py-2 text-xs font-semibold text-white transition-all flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add 1</span>
                </button>
                <button
                  onClick={() => adjustFruit(-1)}
                  disabled={fruitIntake <= 0}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/5 hover:border-white/10 rounded-xl py-2 text-xs font-semibold text-white transition-all flex items-center justify-center"
                >
                  <span>Remove 1</span>
                </button>
              </div>
            </GlassCard>

          </div>

        </div>

      </div>

      {/* QUICK NAVIGATION SECTION */}
      <div className="mt-12">
        <h3 className="text-lg font-bold tracking-tight mb-5 text-white/80">Quick Navigation</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {navCards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className={`text-left group glass-panel rounded-2xl p-5 border border-white/5 transition-all duration-300 hover:bg-white/[0.03] ${card.border}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs uppercase tracking-widest font-bold ${card.color}`}>
                  {card.title}
                </span>
                <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white/70 group-hover:translate-x-1.5 transition-all" />
              </div>
              <h4 className="text-sm font-medium text-white group-hover:text-white/90">
                {card.desc}
              </h4>
            </button>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
