import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { mealLibrary } from '../data/mealLibrary';
import { GlassCard } from '../components/GlassCard';
import { 
  Calendar, 
  Settings, 
  Save, 
  X, 
  Utensils, 
  Apple, 
  Leaf, 
  Egg, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const WeeklyPlanner = () => {
  const { planner, updatePlannerDay } = useContext(AppContext);
  const [editingDay, setEditingDay] = useState(null);

  // Form states
  const [dayType, setDayType] = useState('Veg');
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [fruit, setFruit] = useState('');
  const [vegMethod, setVegMethod] = useState('');

  const startEdit = (day) => {
    const data = planner[day];
    setEditingDay(day);
    setDayType(data.dayType);
    setBreakfast(data.breakfast);
    setLunch(data.lunch);
    setDinner(data.dinner);
    setFruit(data.fruit);
    setVegMethod(data.vegMethod);
  };

  const cancelEdit = () => {
    setEditingDay(null);
  };

  const handleSave = (day) => {
    updatePlannerDay(day, {
      dayType,
      breakfast,
      lunch,
      dinner,
      fruit,
      vegMethod
    });
    setEditingDay(null);
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 md:pt-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-semibold uppercase tracking-widest font-mono">
              7-Day Macro Calendar
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Weekly Planner
          </h2>
          <p className="text-sm text-white/50">
            Organize daily meal profiles, vegetable integration systems, and veg/non-veg status.
          </p>
        </div>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weekdays.map((day, idx) => {
          const data = planner[day];
          const isVeg = data.dayType === 'Veg';
          const isEditing = editingDay === day;

          return (
            <GlassCard 
              key={day} 
              delay={idx * 0.04} 
              className={`flex flex-col justify-between border ${
                isVeg ? 'hover:border-emerald-500/15' : 'hover:border-rose-400/15'
              }`}
              hoverEffect={!isEditing}
            >
              <div>
                {/* Day Header */}
                <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-white/5">
                  <h3 className="font-bold text-lg text-white">{day}</h3>
                  
                  {/* Veg / Non-Veg Badge */}
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isVeg 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {data.dayType}
                  </span>
                </div>

                {/* Info List */}
                {!isEditing ? (
                  <div className="space-y-4 text-xs">
                    {/* Breakfast */}
                    <div className="flex items-start space-x-2">
                      <Utensils className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-white/40 block font-mono uppercase">Breakfast</span>
                        <span className="text-white/80 font-medium">{data.breakfast}</span>
                      </div>
                    </div>

                    {/* Lunch */}
                    <div className="flex items-start space-x-2">
                      <Utensils className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-white/40 block font-mono uppercase">Lunch</span>
                        <span className="text-white/80 font-medium">{data.lunch}</span>
                      </div>
                    </div>

                    {/* Dinner */}
                    <div className="flex items-start space-x-2">
                      <Utensils className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-white/40 block font-mono uppercase">Dinner</span>
                        <span className="text-white/80 font-medium">{data.dinner}</span>
                      </div>
                    </div>

                    {/* Fruit */}
                    <div className="flex items-start space-x-2">
                      <Apple className="w-4 h-4 text-cyan-400/40 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-cyan-400/50 block font-mono uppercase">Fruit Intake</span>
                        <span className="text-cyan-300/80 font-medium">{data.fruit}</span>
                      </div>
                    </div>

                    {/* Veg Method */}
                    <div className="flex items-start space-x-2 pt-2 border-t border-white/5">
                      <Leaf className="w-4 h-4 text-emerald-400/40 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-emerald-400/50 block font-mono uppercase">Vegetable Method</span>
                        <span className="text-emerald-300/80 font-light leading-relaxed block">{data.vegMethod}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Editing Form
                  <div className="space-y-3">
                    
                    {/* Day Type Toggle */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Day Type</label>
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button
                          type="button"
                          onClick={() => setDayType('Veg')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            dayType === 'Veg' ? 'bg-emerald-500 text-darkBg' : 'text-white/60'
                          }`}
                        >
                          Veg
                        </button>
                        <button
                          type="button"
                          onClick={() => setDayType('Non-Veg')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            dayType === 'Non-Veg' ? 'bg-rose-500 text-darkBg' : 'text-white/60'
                          }`}
                        >
                          Non-Veg
                        </button>
                      </div>
                    </div>

                    {/* Breakfast Select */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Breakfast</label>
                      <select
                        value={breakfast}
                        onChange={(e) => setBreakfast(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-luxuryGold/40"
                      >
                        {mealLibrary.breakfast.map(meal => (
                          <option key={meal.id} value={meal.name} className="bg-darkBg text-white">{meal.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Lunch Select */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Lunch</label>
                      <select
                        value={lunch}
                        onChange={(e) => setLunch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-luxuryGold/40"
                      >
                        {mealLibrary.lunch.map(meal => (
                          <option key={meal.id} value={meal.name} className="bg-darkBg text-white">{meal.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dinner Select */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Dinner</label>
                      <select
                        value={dinner}
                        onChange={(e) => setDinner(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-luxuryGold/40"
                      >
                        {mealLibrary.dinner.map(meal => (
                          <option key={meal.id} value={meal.name} className="bg-darkBg text-white">{meal.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fruit Input */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Fruit Option</label>
                      <input
                        type="text"
                        value={fruit}
                        onChange={(e) => setFruit(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-luxuryGold/40"
                        placeholder="e.g. Banana (Pre-workout)"
                      />
                    </div>

                    {/* Vegetable Method Input */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Vegetable Method</label>
                      <textarea
                        value={vegMethod}
                        onChange={(e) => setVegMethod(e.target.value)}
                        rows="2"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-luxuryGold/40 resize-none"
                        placeholder="e.g. Sliced beetroot & salad"
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-white/5 flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => startEdit(day)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Customize Day</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSave(day)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-luxuryGold hover:bg-amber-500 text-darkBg text-xs font-bold transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
              </div>

            </GlassCard>
          );
        })}
      </div>
    </motion.div>
  );
};
