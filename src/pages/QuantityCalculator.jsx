import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Scale, 
  Sparkles, 
  Users, 
  Dumbbell, 
  Droplet, 
  Flame, 
  Check, 
  ChevronRight,
  RefreshCw,
  Gauge
} from 'lucide-react';

export const QuantityCalculator = () => {
  const { targets, updateTargets } = useContext(AppContext);

  // Active sub-calculator: 'rice' | 'protein' | 'calories' | 'water'
  const [activeCalc, setActiveCalc] = useState('rice');

  // Rice Calculator States
  const [peopleCount, setPeopleCount] = useState(2);
  const [riceType, setRiceType] = useState('white'); // white (75g) | brown (80g)

  // Protein Calculator States
  const [weightKg, setWeightKg] = useState(70);
  const [activityLevel, setActivityLevel] = useState('moderate'); // sedentary (1.2) | moderate (1.6) | athletic (2.0)
  const [proteinGoal, setProteinGoal] = useState('build'); // maintenance (1.5) | build (2.2) | fatLoss (2.0)
  const [appliedProtein, setAppliedProtein] = useState(false);

  // Calories Calculator States
  const [heightCm, setHeightCm] = useState(175);
  const [ageYears, setAgeYears] = useState(25);
  const [gender, setGender] = useState('male');
  const [calGoal, setCalGoal] = useState('cut'); // cut (-400) | maintain (0) | bulk (+400)
  const [appliedCalories, setAppliedCalories] = useState(false);

  // Water Calculator States
  const [climate, setClimate] = useState('hot'); // cool (30ml/kg) | hot (40ml/kg)
  const [workoutMins, setWorkoutMins] = useState(60); // 500ml per 60 mins
  const [appliedWater, setAppliedWater] = useState(false);

  // Calculations
  const calculateRiceRaw = () => {
    const basePerPerson = riceType === 'white' ? 75 : 80;
    return peopleCount * basePerPerson;
  };

  const calculateRiceCooked = () => {
    // Cooked rice is approx 2.5x raw rice weight
    return Math.round(calculateRiceRaw() * 2.5);
  };

  const calculateProtein = () => {
    let multiplier = 1.6;
    if (activityLevel === 'sedentary') multiplier = 1.2;
    if (activityLevel === 'athletic') multiplier = 2.0;

    // Adjust for goals
    if (proteinGoal === 'build') multiplier += 0.2;
    if (proteinGoal === 'fatLoss') multiplier += 0.1;

    return Math.round(weightKg * multiplier);
  };

  const calculateCalories = () => {
    // Harris-Benedict Formula
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageYears);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageYears);
    }

    let tdeeMultiplier = 1.375; // light activity
    if (activityLevel === 'moderate') tdeeMultiplier = 1.55;
    if (activityLevel === 'athletic') tdeeMultiplier = 1.725;

    let tdee = bmr * tdeeMultiplier;

    if (calGoal === 'cut') tdee -= 400;
    if (calGoal === 'bulk') tdee += 400;

    return Math.round(tdee);
  };

  const calculateWater = () => {
    // Base intake: 35ml/kg for mild/cool, 45ml/kg for hot
    const baseMlPerKg = climate === 'hot' ? 42 : 32;
    const baseWater = weightKg * baseMlPerKg;
    const workoutExtra = (workoutMins / 30) * 250; // 250ml per 30 mins workout
    return Math.round((baseWater + workoutExtra) / 250) * 250; // round to nearest 250ml cup
  };

  const applyProteinTarget = () => {
    updateTargets({ protein: calculateProtein() });
    setAppliedProtein(true);
    setTimeout(() => setAppliedProtein(false), 2000);
  };

  const applyCaloriesTarget = () => {
    updateTargets({ calories: calculateCalories() });
    setAppliedCalories(true);
    setTimeout(() => setAppliedCalories(false), 2000);
  };

  const applyWaterTarget = () => {
    updateTargets({ water: calculateWater() });
    setAppliedWater(true);
    setTimeout(() => setAppliedWater(false), 2000);
  };

  const calculatorTabs = [
    { id: 'rice', label: 'Rice Measure', icon: Scale, color: 'text-luxuryGold' },
    { id: 'protein', label: 'Protein Target', icon: Dumbbell, color: 'text-luxuryRose' },
    { id: 'calories', label: 'TDEE Calories', icon: Flame, color: 'text-rose-400' },
    { id: 'water', label: 'Hydration Target', icon: Droplet, color: 'text-cyan-400' }
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
          <Gauge className="w-5 h-5 text-luxuryRose" />
          <span className="text-xs text-luxuryRose font-semibold uppercase tracking-widest font-mono">
            Biometric Calculations
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Quantity Calculator
        </h2>
        <p className="text-sm text-white/50">
          Tailored raw kitchen scales and customized physiological targets.
        </p>
      </div>

      {/* Calc Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
        {calculatorTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCalc === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCalc(tab.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                isActive
                  ? 'bg-white/5 border-white/10 text-white shadow-lg shadow-black/30'
                  : 'bg-transparent border-white/5 text-white/45 hover:text-white/70 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/30 mb-0.5">TOOL</span>
                <span className="text-sm font-semibold">{tab.label.split(' ')[0]}</span>
              </div>
              <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-white/35'}`} />
            </button>
          );
        })}
      </div>

      {/* Calculator Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCalc}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          
          {/* LEFT: Controls (7 Cols) */}
          <div className="lg:col-span-7">
            <GlassCard hoverEffect={false}>
              
              {/* RICE CALCULATOR */}
              {activeCalc === 'rice' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-luxuryGold" />
                      <span>Rice Servings Scaler</span>
                    </h3>
                    <span className="text-xs text-white/40 font-mono">1 PERSON = 75G RAW</span>
                  </div>

                  {/* Grain Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/40 block mb-2">Grain Variant</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRiceType('white')}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          riceType === 'white' 
                            ? 'bg-luxuryGold/10 border-luxuryGold/40 text-luxuryGold shadow-[0_0_15px_rgba(229,192,123,0.08)]' 
                            : 'border-white/5 bg-transparent text-white/60 hover:border-white/10'
                        }`}
                      >
                        Basmati White (75g/p)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRiceType('brown')}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          riceType === 'brown' 
                            ? 'bg-luxuryGold/10 border-luxuryGold/40 text-luxuryGold shadow-[0_0_15px_rgba(229,192,123,0.08)]' 
                            : 'border-white/5 bg-transparent text-white/60 hover:border-white/10'
                        }`}
                      >
                        Indigestible Brown (80g/p)
                      </button>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-white/60">Number of Diners:</span>
                      <span className="text-xl font-black text-luxuryGold glow-text-gold">{peopleCount} <span className="text-xs font-normal text-white/40">people</span></span>
                    </div>
                    
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                      className="w-full accent-luxuryGold bg-white/10 rounded-lg appearance-none h-1.5 focus:outline-none cursor-pointer"
                    />
                    
                    <div className="flex justify-between text-[10px] text-white/30 font-mono">
                      <span>1 PERSON</span>
                      <span>5 PEOPLE</span>
                      <span>10 PEOPLE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PROTEIN CALCULATOR */}
              {activeCalc === 'protein' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <Dumbbell className="w-5 h-5 text-luxuryRose" />
                      <span>Protein Requirement Calculator</span>
                    </h3>
                  </div>

                  {/* Weight Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white/60">Body Weight:</span>
                      <span className="text-lg font-bold text-luxuryRose">{weightKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="120"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseInt(e.target.value))}
                      className="w-full accent-luxuryRose bg-white/10 rounded-lg appearance-none h-1.5 focus:outline-none cursor-pointer"
                    />
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/40 block mb-2">Weekly Activity Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'sedentary', label: 'Sedentary', desc: 'No Training' },
                        { id: 'moderate', label: 'Moderate', desc: '3-4x/week' },
                        { id: 'athletic', label: 'Athletic', desc: 'Hard 5-6x/week' }
                      ].map(act => (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => setActivityLevel(act.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                            activityLevel === act.id
                              ? 'bg-luxuryRose/10 border-luxuryRose/40 text-luxuryRose'
                              : 'border-white/5 bg-transparent text-white/50 hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-bold">{act.label}</span>
                          <span className="text-[9px] text-white/30 mt-0.5">{act.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal Level */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/40 block mb-2">Primary Fitness Goal</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'maintenance', label: 'Maintenance', desc: 'Stay same' },
                        { id: 'build', label: 'Muscle Gain', desc: 'Hypertrophy' },
                        { id: 'fatLoss', label: 'Fat Shredding', desc: 'Deficit lean' }
                      ].map(goal => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setProteinGoal(goal.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                            proteinGoal === goal.id
                              ? 'bg-luxuryRose/10 border-luxuryRose/40 text-luxuryRose'
                              : 'border-white/5 bg-transparent text-white/50 hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-bold">{goal.label}</span>
                          <span className="text-[9px] text-white/30 mt-0.5">{goal.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* CALORIES CALCULATOR */}
              {activeCalc === 'calories' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-rose-400" />
                    <span>Total Daily Energy Expenditure (TDEE)</span>
                  </h3>

                  {/* Standard parameters input */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-400/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-400/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Age (years)</label>
                      <input
                        type="number"
                        value={ageYears}
                        onChange={(e) => setAgeYears(parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-400/40"
                      />
                    </div>
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/40 block mb-1.5">Gender Selection</label>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          gender === 'male' ? 'bg-rose-400 text-darkBg' : 'text-white/60'
                        }`}
                      >
                        Male (BMR Offset +88)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          gender === 'female' ? 'bg-rose-400 text-darkBg' : 'text-white/60'
                        }`}
                      >
                        Female (BMR Offset +447)
                      </button>
                    </div>
                  </div>

                  {/* Activity Level Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/40 block mb-1.5">Weekly Activity Level</label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400/40"
                    >
                      <option value="sedentary" className="bg-darkBg text-white">Sedentary (Little or no exercise)</option>
                      <option value="moderate" className="bg-darkBg text-white">Moderately Active (Light workout 3-4x/week)</option>
                      <option value="athletic" className="bg-darkBg text-white">Athletic (Intense training 5-6x/week)</option>
                    </select>
                  </div>

                  {/* Caloric Goal Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/40 block mb-1.5">Caloric Plan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'cut', label: 'Weight Cut', desc: '-400 kcal Deficit' },
                        { id: 'maintain', label: 'Maintenance', desc: '0 kcal Shift' },
                        { id: 'bulk', label: 'Clean Bulk', desc: '+400 kcal Surplus' }
                      ].map(goal => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setCalGoal(goal.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                            calGoal === goal.id
                              ? 'bg-rose-400/10 border-rose-400/40 text-rose-300'
                              : 'border-white/5 bg-transparent text-white/50 hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-bold">{goal.label}</span>
                          <span className="text-[9px] text-white/30 mt-0.5">{goal.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* WATER CALCULATOR */}
              {activeCalc === 'water' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Droplet className="w-5 h-5 text-cyan-400" />
                    <span>Hydration Fluid Calculator</span>
                  </h3>

                  {/* Weight Input */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white/60">Current Weight:</span>
                      <span className="text-lg font-bold text-cyan-400">{weightKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="120"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 bg-white/10 rounded-lg appearance-none h-1.5 focus:outline-none cursor-pointer"
                    />
                  </div>

                  {/* Climate selection */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-white/40 block mb-2">Climate Condition</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setClimate('cool')}
                        className={`py-3.5 rounded-xl border text-xs font-bold transition-all ${
                          climate === 'cool' 
                            ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.08)]' 
                            : 'border-white/5 bg-transparent text-white/60 hover:border-white/10'
                        }`}
                      >
                        Cool / Air Conditioned (32ml/kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => setClimate('hot')}
                        className={`py-3.5 rounded-xl border text-xs font-bold transition-all ${
                          climate === 'hot' 
                            ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.08)]' 
                            : 'border-white/5 bg-transparent text-white/60 hover:border-white/10'
                        }`}
                      >
                        Hot / High Sweat (42ml/kg)
                      </button>
                    </div>
                  </div>

                  {/* Workout Minutes */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white/60">Daily Training Duration:</span>
                      <span className="text-lg font-bold text-cyan-400">{workoutMins} minutes</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="15"
                      value={workoutMins}
                      onChange={(e) => setWorkoutMins(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 bg-white/10 rounded-lg appearance-none h-1.5 focus:outline-none cursor-pointer"
                    />
                  </div>

                </div>
              )}

            </GlassCard>
          </div>

          {/* RIGHT: Results Display (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <GlassCard delay={0.08} glow glowColor={activeCalc === 'rice' ? 'gold' : activeCalc === 'protein' ? 'rose' : activeCalc === 'calories' ? 'rose' : 'teal'} className="h-full flex flex-col justify-between border-white/10">
              
              <div className="text-center py-6">
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mb-1">
                  CALCULATED OUTPUTS
                </span>
                
                {/* RICE OUTPUT */}
                {activeCalc === 'rice' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white/60">Steamed Rice Requirement</h4>
                    <div className="my-8">
                      <div className="text-5xl font-black text-luxuryGold glow-text-gold tracking-tight">{calculateRiceRaw()}g</div>
                      <span className="text-xs text-white/30 uppercase tracking-widest font-mono">Raw Basmati Weight</span>
                    </div>
                    
                    {/* Visual Bowl Indicator */}
                    <div className="w-full flex justify-center py-4">
                      <div className="relative w-28 h-14 bg-white/5 rounded-b-full border-b border-x border-white/20 overflow-hidden flex items-center justify-center p-[1px]">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.min(100, (calculateRiceRaw() / 750) * 100)}%` }}
                          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-luxuryGold/20 via-luxuryGold/40 to-luxuryGold/50 border-t border-luxuryGold/40"
                        />
                        <span className="z-10 text-[10px] font-bold tracking-widest text-white font-mono uppercase">
                          {calculateRiceCooked()}g Cooked
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-white/40 leading-relaxed font-light px-4">
                      Boiling this quantity will yield approximately <strong className="text-white">{calculateRiceCooked()}g</strong> of cooked fluffy rice.
                    </p>
                  </div>
                )}

                {/* PROTEIN OUTPUT */}
                {activeCalc === 'protein' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white/60">Optimum Protein Target</h4>
                    <div className="my-8">
                      <div className="text-5xl font-black text-luxuryRose glow-text-rose tracking-tight">{calculateProtein()}g</div>
                      <span className="text-xs text-white/30 uppercase tracking-widest font-mono">Daily Target Weight</span>
                    </div>

                    <p className="text-xs text-white/40 leading-relaxed font-light px-4 pb-6">
                      Recommended to build skeletal muscles based on a weight of {weightKg}kg and activity selection.
                    </p>

                    <button
                      onClick={applyProteinTarget}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all border ${
                        appliedProtein 
                          ? 'bg-emerald-500 border-emerald-500 text-darkBg' 
                          : 'bg-luxuryRose hover:bg-rose-400 border-luxuryRose text-darkBg shadow-[0_4px_20px_rgba(224,168,153,0.2)]'
                      }`}
                    >
                      {appliedProtein ? (
                        <span className="flex items-center justify-center space-x-1">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Applied to Dashboard!</span>
                        </span>
                      ) : (
                        <span>Apply Target to Dashboard</span>
                      )}
                    </button>
                  </div>
                )}

                {/* CALORIES OUTPUT */}
                {activeCalc === 'calories' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white/60">Estimated Daily Calories</h4>
                    <div className="my-8">
                      <div className="text-5xl font-black text-rose-400 glow-text-rose tracking-tight">{calculateCalories()} kcal</div>
                      <span className="text-xs text-white/30 uppercase tracking-widest font-mono">Target Energetic Load</span>
                    </div>

                    <p className="text-xs text-white/40 leading-relaxed font-light px-4 pb-6">
                      Derived via biological formulas. Goal: <span className="text-rose-400 font-bold uppercase">{calGoal}</span>.
                    </p>

                    <button
                      onClick={applyCaloriesTarget}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all border ${
                        appliedCalories 
                          ? 'bg-emerald-500 border-emerald-500 text-darkBg' 
                          : 'bg-rose-400 hover:bg-rose-300 border-rose-400 text-darkBg shadow-[0_4px_20px_rgba(244,63,94,0.2)]'
                      }`}
                    >
                      {appliedCalories ? (
                        <span className="flex items-center justify-center space-x-1">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Applied to Dashboard!</span>
                        </span>
                      ) : (
                        <span>Apply Target to Dashboard</span>
                      )}
                    </button>
                  </div>
                )}

                {/* WATER OUTPUT */}
                {activeCalc === 'water' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white/60">Target Fluid Volume</h4>
                    <div className="my-8">
                      <div className="text-5xl font-black text-cyan-400 glow-text-teal tracking-tight">{(calculateWater() / 1000).toFixed(2)}L</div>
                      <span className="text-xs text-white/30 uppercase tracking-widest font-mono">{calculateWater()} ML REQUIRED</span>
                    </div>

                    <p className="text-xs text-white/40 leading-relaxed font-light px-4 pb-6">
                      Covers core metabolic functions, elevated training sweat loss, and local hot climate.
                    </p>

                    <button
                      onClick={applyWaterTarget}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all border ${
                        appliedWater 
                          ? 'bg-emerald-500 border-emerald-500 text-darkBg' 
                          : 'bg-cyan-400 hover:bg-cyan-300 border-cyan-400 text-darkBg shadow-[0_4px_20px_rgba(34,211,238,0.2)]'
                      }`}
                    >
                      {appliedWater ? (
                        <span className="flex items-center justify-center space-x-1">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Applied to Dashboard!</span>
                        </span>
                      ) : (
                        <span>Apply Target to Dashboard</span>
                      )}
                    </button>
                  </div>
                )}

              </div>

              {/* Sync check bottom footer */}
              <div className="border-t border-white/5 pt-4 text-left text-[10px] text-white/30 tracking-wider font-mono flex justify-between items-center">
                <span>DASHBOARD TARGETS SYNCED</span>
                <span>STATUS: STABLE</span>
              </div>

            </GlassCard>
          </div>

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
