import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
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
  ChevronDown,
  Trash2,
  Copy,
  Check,
  Plus
} from 'lucide-react';

export const WeeklyPlanner = () => {
  const { planner, updatePlannerDay, meals } = useContext(AppContext);
  const [editingDay, setEditingDay] = useState(null);

  // Form states
  const [dayType, setDayType] = useState('Veg');
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [fruit, setFruit] = useState('');
  const [vegMethod, setVegMethod] = useState('');

  // Grocery checklist states
  const [isGroceryOpen, setIsGroceryOpen] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState({});
  const [extraGroceryItems, setExtraGroceryItems] = useState([]);
  const [newExtraItem, setNewExtraItem] = useState('');
  const [copiedList, setCopiedList] = useState(false);

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

        {/* Generate Grocery List Button */}
        <button
          onClick={() => setIsGroceryOpen(true)}
          className="flex items-center justify-center space-x-2 bg-cyan-400 hover:bg-cyan-500 text-darkBg text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-400/10 cursor-pointer"
        >
          <Utensils className="w-4 h-4 stroke-[2.5]" />
          <span>Generate Grocery List</span>
        </button>
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
                        {(meals.breakfast || []).map(meal => (
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
                        {(meals.lunch || []).map(meal => (
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
                        {(meals.dinner || []).map(meal => (
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

      {/* Grocery Helper Methods & Panel */}
      {(() => {
        const generateGroceryList = () => {
          const list = [];
          
          weekdays.forEach(day => {
            const dayData = planner[day];
            if (!dayData) return;
            
            const mealsForDay = [
              { name: dayData.breakfast, category: 'breakfast' },
              { name: dayData.lunch, category: 'lunch' },
              { name: dayData.dinner, category: 'dinner' }
            ];
            
            mealsForDay.forEach(item => {
              if (!item.name) return;
              const mealObj = meals[item.category]?.find(m => m.name === item.name);
              if (mealObj && mealObj.ingredients) {
                mealObj.ingredients.forEach(ing => {
                  if (!list.includes(ing)) {
                    list.push(ing);
                  }
                });
              }
            });
            
            if (dayData.fruit && dayData.fruit !== 'None' && dayData.fruit.trim() !== '') {
              const fruitIng = `${dayData.fruit} (Fruit)`;
              if (!list.includes(fruitIng)) {
                list.push(fruitIng);
              }
            }
          });
          
          return list;
        };

        const toggleGroceryCheck = (item) => {
          setCheckedStatus(prev => ({
            ...prev,
            [item]: !prev[item]
          }));
        };

        const addExtraGroceryItem = (e) => {
          e.preventDefault();
          if (newExtraItem.trim() !== '') {
            setExtraGroceryItems(prev => [...prev, newExtraItem.trim()]);
            setNewExtraItem('');
          }
        };

        const removeExtraGroceryItem = (index) => {
          setExtraGroceryItems(prev => prev.filter((_, i) => i !== index));
        };

        const copyListToClipboard = () => {
          const checkedItems = [];
          const uncheckedItems = [];
          
          const allIngredients = [...generateGroceryList(), ...extraGroceryItems];
          
          allIngredients.forEach(item => {
            if (checkedStatus[item]) {
              checkedItems.push(`[x] ${item}`);
            } else {
              uncheckedItems.push(`[ ] ${item}`);
            }
          });
          
          const text = `MAYUR'S SHOPPING LIST:\n\nTO BUY:\n${uncheckedItems.join('\n')}\n\nALREADY HAVE:\n${checkedItems.join('\n')}`;
          navigator.clipboard.writeText(text);
          setCopiedList(true);
          setTimeout(() => setCopiedList(false), 2000);
        };

        return (
          <AnimatePresence>
            {isGroceryOpen && (
              <div className="fixed inset-0 z-50 flex justify-end">
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsGroceryOpen(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                />
                
                {/* Drawer Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="glass-panel w-full max-w-md border-l border-white/10 h-screen bg-[#0F1117]/95 shadow-2xl relative z-10 flex flex-col justify-between"
                >
                  {/* Drawer Header */}
                  <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg tracking-wide">Grocery Checklist</h3>
                        <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest font-mono">Consolidated Ingredients</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsGroceryOpen(false)}
                      className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                    
                    {/* Info Tip */}
                    <div className="p-3 bg-cyan-400/5 border border-cyan-400/10 rounded-xl text-[11px] text-cyan-300/80 leading-relaxed flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5 animate-pulse-slow" />
                      <span>
                        Aggregated list of raw ingredients compiled from all meals planned in your 7-day diet calendar.
                      </span>
                    </div>

                    {/* Ingredients Checkable List */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-white/50 font-mono">Diet Ingredients</h4>
                      
                      {generateGroceryList().length > 0 ? (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                          {generateGroceryList().map((item, idx) => {
                            const isChecked = !!checkedStatus[item];
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleGroceryCheck(item)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all duration-300 cursor-pointer ${
                                  isChecked 
                                    ? 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20' 
                                    : 'border-white/5 bg-white/[0.01] text-white hover:border-white/10'
                                }`}
                              >
                                <span className={isChecked ? 'line-through' : 'font-medium'}>{item}</span>
                                <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                                  isChecked ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 text-darkBg stroke-[3.5]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-white/5 rounded-xl text-white/30 text-[11px]">
                          No meals selected in the Weekly Planner yet.
                        </div>
                      )}
                    </div>

                    {/* Extra Shopping Items List */}
                    <div className="space-y-3 border-t border-white/5 pt-5">
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-white/50 font-mono">Extra Items</h4>
                      
                      {extraGroceryItems.length > 0 && (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 no-scrollbar">
                          {extraGroceryItems.map((item, idx) => {
                            const isChecked = !!checkedStatus[item];
                            return (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all duration-300 ${
                                  isChecked 
                                    ? 'bg-white/[0.02] border-white/10 text-white/40' 
                                    : 'border-white/5 bg-white/[0.01] text-white'
                                }`}
                              >
                                <button
                                  onClick={() => toggleGroceryCheck(item)}
                                  className="flex-1 text-left cursor-pointer"
                                >
                                  <span className={isChecked ? 'line-through' : 'font-medium'}>{item}</span>
                                </button>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => removeExtraGroceryItem(idx)}
                                    className="text-white/30 hover:text-rose-400 p-1 hover:bg-white/5 rounded cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => toggleGroceryCheck(item)}
                                    className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                                      isChecked ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3 text-darkBg stroke-[3.5]" />}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Extra Item Form */}
                      <form onSubmit={addExtraGroceryItem} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add custom item (e.g. Milk, Eggs)"
                          value={newExtraItem}
                          onChange={(e) => setNewExtraItem(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/35 focus:outline-none focus:border-cyan-400/40"
                        />
                        <button
                          type="submit"
                          className="bg-cyan-400 hover:bg-cyan-500 text-darkBg px-3 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </form>
                    </div>

                  </div>

                  {/* Drawer Footer */}
                  <div className="px-6 py-5 border-t border-white/5 bg-white/[0.01] flex space-x-3">
                    <button
                      onClick={() => setIsGroceryOpen(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 rounded-xl transition-all text-xs cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={copyListToClipboard}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-darkBg font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-400/10 cursor-pointer"
                    >
                      {copiedList ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedList ? 'Copied ✓' : 'Copy Shopping List'}</span>
                    </button>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>
        );
      })()}

    </motion.div>
  );
};
