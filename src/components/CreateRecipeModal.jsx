import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { X, Plus, Trash2, Sparkles, ChefHat } from 'lucide-react';

export const CreateRecipeModal = ({ isOpen, onClose, activeCategory = 'breakfast' }) => {
  const { addCustomMeal } = useContext(AppContext);

  // Form states
  const [category, setCategory] = useState(activeCategory);
  const [name, setName] = useState('');
  const [time, setTime] = useState('15 mins');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [imagePath, setImagePath] = useState('');

  // Auto-set default image paths based on category choice
  useEffect(() => {
    if (!imagePath || imagePath.startsWith('/images/')) {
      if (category === 'breakfast') setImagePath('/images/breakfast/b1_oats_bowl.jpg');
      if (category === 'lunch') setImagePath('/images/lunch/l1_rice_dal.jpg');
      if (category === 'dinner') setImagePath('/images/dinner/d1_paneer_bhurji.jpg');
    }
  }, [category]);

  // Set category when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategory(activeCategory);
    }
  }, [isOpen, activeCategory]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated.length > 0 ? updated : ['']);
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    // Filter out empty ingredients
    const cleanIngredients = ingredients.filter(ing => ing.trim() !== '');

    const newMeal = {
      name: name.trim(),
      time: time.trim(),
      protein: protein ? (protein.toString().toLowerCase().endsWith('g') ? protein.trim() : `${protein.trim()}g`) : '0g',
      carbs: carbs ? (carbs.toString().toLowerCase().endsWith('g') ? carbs.trim() : `${carbs.trim()}g`) : '0g',
      fat: fat ? (fat.toString().toLowerCase().endsWith('g') ? fat.trim() : `${fat.trim()}g`) : '0g',
      calories: parseInt(calories) || 0,
      ingredients: cleanIngredients.length > 0 ? cleanIngredients : ['Fresh Ingredients'],
      instructions: instructions.trim() || 'Mix ingredients and serve.',
      image: imagePath.trim(),
      isCustom: true // Badge indicator
    };

    addCustomMeal(category, newMeal);
    
    // Reset form
    setName('');
    setTime('15 mins');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setIngredients(['']);
    setInstructions('');
    setImagePath('');
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="glass-panel w-full max-w-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] bg-[#0F1117]/95"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-luxuryGold/10 text-luxuryGold">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-wide">Create Custom Recipe</h3>
                  <p className="text-[10px] text-luxuryGold font-semibold uppercase tracking-widest font-mono">Kitchen Laboratory</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-white/70 no-scrollbar">
              
              {/* Category selector */}
              <div>
                <label className="text-[10px] font-mono uppercase text-white/40 block mb-1">Meal Category</label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  {['breakfast', 'lunch', 'dinner'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                        category === cat ? 'bg-luxuryGold text-darkBg' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Prep Time */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-white/60 font-semibold">Recipe Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Creamy Paneer Salad"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60">Prep Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="15 mins"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs"
                  />
                </div>
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-white/60">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="350"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60">Protein (g)</label>
                  <input
                    type="text"
                    placeholder="20"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60">Carbs (g)</label>
                  <input
                    type="text"
                    placeholder="35"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60">Fat (g)</label>
                  <input
                    type="text"
                    placeholder="10"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs"
                  />
                </div>
              </div>

              {/* Image Path */}
              <div className="space-y-1">
                <label className="text-white/60">Image Path / URL</label>
                <input
                  type="text"
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                  placeholder="/images/breakfast/b1_oats_bowl.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-luxuryGold/40"
                />
                <p className="text-[10px] text-white/30">Defaults to a beautiful themed image. Customize if you have local folders.</p>
              </div>

              {/* Ingredients List */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-white/60 font-semibold">Ingredients</label>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="text-luxuryGold hover:text-amber-300 flex items-center space-x-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                  {ingredients.map((ingredient, idx) => (
                    <div key={idx} className="flex space-x-2 items-center">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(idx, e.target.value)}
                        placeholder={`e.g. Low Fat Paneer (100g) or Oats (50g)`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-white/30 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 transition-all shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1">
                <label className="text-white/60">Cooking Steps / Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows="3"
                  placeholder="Step 1. Boil oats... Step 2. Slice bananas..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-luxuryGold/40 text-xs resize-none"
                />
              </div>

            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-luxuryGold hover:bg-amber-500 text-darkBg font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-luxuryGold/10"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Recipe</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
