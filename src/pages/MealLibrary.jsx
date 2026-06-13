import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mealLibrary } from '../data/mealLibrary';
import { GlassCard } from '../components/GlassCard';
import { Clock, Dumbbell, Sparkles, ChefHat, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';

export const MealLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    { id: 'breakfast', label: 'Breakfast Collections' },
    { id: 'lunch', label: 'Mid-Day Lunch' },
    { id: 'dinner', label: 'Soothing Dinners' }
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredMeals = mealLibrary[activeCategory].filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 md:pt-8"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <ChefHat className="w-5 h-5 text-luxuryGold" />
            <span className="text-xs text-luxuryGold font-semibold uppercase tracking-widest font-mono">
              La Carte de Aura
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Meal Library
          </h2>
          <p className="text-sm text-white/50">
            Aesthetic menu items built to optimize protein, time, and digestion.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by meal or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-luxuryGold/40 transition-all focus:ring-1 focus:ring-luxuryGold/20"
          />
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex space-x-2 p-1.5 glass-panel rounded-xl border-white/5 mb-8 w-full max-w-md mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setExpandedId(null);
            }}
            className={`relative flex-1 text-center py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-300 ${
              activeCategory === cat.id ? 'text-darkBg font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            {activeCategory === cat.id && (
              <motion.div
                layoutId="activeCategoryIndicator"
                className="absolute inset-0 bg-luxuryGold rounded-lg z-0"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
            <span className="relative z-10">{cat.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Grid of Luxury Meal Cards */}
      {filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMeals.map((meal, index) => {
              const isExpanded = expandedId === meal.id;

              return (
                <motion.div
                  key={meal.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GlassCard 
                    delay={index * 0.05} 
                    className="overflow-hidden flex flex-col justify-between p-0! h-full border border-white/5 hover:border-luxuryGold/15"
                    glow={isExpanded}
                    glowColor="gold"
                    hoverEffect={!isExpanded}
                  >
                    
                    {/* Food Image header */}
                    <div className="h-44 w-full overflow-hidden relative group isolate transform-gpu">
                      <img 
                        src={meal.image} 
                        alt={meal.name} 
                        className="w-full h-full object-cover transition-transform duration-500 will-change-transform transform-gpu group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                        loading="lazy"
                      />
                      
                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/30 to-transparent pointer-events-none z-10" />
                      
                      {/* Floating protein badge */}
                      <div className="absolute top-4 right-4 flex items-center space-x-1 bg-darkBg/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-luxuryGold font-mono">
                        <Dumbbell className="w-3.5 h-3.5" />
                        <span>{meal.protein} Protein</span>
                      </div>

                      {/* Cook time badge */}
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 bg-darkBg/60 backdrop-blur-md border border-white/5 px-2.5 py-0.5 rounded-lg text-[10px] text-white/70">
                        <Clock className="w-3 h-3 text-white/50" />
                        <span>{meal.time}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-white mb-2 leading-snug group-hover:text-luxuryGold transition-colors">
                          {meal.name}
                        </h3>
                        
                        {/* Macro details preview */}
                        <div className="flex space-x-4 mb-4 text-[10.5px] font-mono text-white/40 border-b border-white/5 pb-2">
                          <span>CAL: <span className="text-white/70">{meal.calories}</span></span>
                          <span>CARB: <span className="text-white/70">{meal.carbs}</span></span>
                          <span>FAT: <span className="text-white/70">{meal.fat}</span></span>
                        </div>

                        {/* Ingredients Checklist Preview */}
                        <div className="mb-4">
                          <span className="text-xs font-semibold text-white/40 block mb-1.5">Key Ingredients:</span>
                          <div className="flex flex-wrap gap-1">
                            {meal.ingredients.slice(0, 3).map((ing, i) => (
                              <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-white/70 font-medium">
                                {ing}
                              </span>
                            ))}
                            {meal.ingredients.length > 3 && (
                              <span className="text-[10px] text-white/40 px-1 py-0.5">
                                +{meal.ingredients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Section (Ingredients & instructions) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden border-t border-white/5 mt-4 pt-4 text-xs"
                          >
                            {/* All Ingredients */}
                            <div className="mb-4">
                              <span className="font-semibold text-white/40 block mb-2 font-mono uppercase tracking-wider text-[10px]">
                                Full Ingredients List:
                              </span>
                              <ul className="space-y-1 text-white/70 leading-relaxed list-disc pl-4 font-light">
                                {meal.ingredients.map((ing, i) => (
                                  <li key={i}>{ing}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Method Instructions */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                              <div className="flex items-center space-x-1.5 text-luxuryGold mb-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="font-bold text-[10px] uppercase tracking-wider font-mono">Chef Instructions:</span>
                              </div>
                              <p className="text-white/60 text-xs leading-relaxed font-light">
                                {meal.instructions}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expand / Close button */}
                      <button
                        onClick={() => toggleExpand(meal.id)}
                        className={`w-full mt-4 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isExpanded 
                            ? 'bg-luxuryGold text-darkBg border-luxuryGold font-bold shadow-[0_0_15px_rgba(229,192,123,0.15)]' 
                            : 'bg-white/5 border-white/5 hover:border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        <span>{isExpanded ? 'Collapse Recipe' : 'Expand Recipe'}</span>
                        {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                      </button>

                    </div>

                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-2xl border-white/5 max-w-md mx-auto">
          <Info className="w-8 h-8 text-white/30 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">No meals found</h3>
          <p className="text-xs text-white/40">Try searching for other ingredients or meals.</p>
        </div>
      )}
    </motion.div>
  );
};
