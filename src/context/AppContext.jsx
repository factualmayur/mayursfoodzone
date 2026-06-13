import React, { createContext, useState, useEffect } from 'react';
import { initialPlanner } from '../data/initialPlanner';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Configurable targets
  const [targets, setTargets] = useState({
    calories: 2000,
    protein: 120, // 120g target
    carbs: 250,
    water: 3000, // 3000ml target
  });

  // Checklist of protein sources consumed today
  const [proteinChecklist, setProteinChecklist] = useState([
    { id: 1, name: 'Skimmed Milk (250ml)', protein: 9, checked: true },
    { id: 2, name: 'Low Fat Paneer (100g)', protein: 20, checked: true },
    { id: 3, name: 'Yellow Moong Dal (50g)', protein: 12, checked: true },
    { id: 4, name: 'Artisan Oats Bowl', protein: 18, checked: false },
    { id: 5, name: 'Soya Chunks (50g)', protein: 26, checked: false },
    { id: 6, name: 'Whole Eggs (3)', protein: 18, checked: false },
  ]);

  // Pre-workout items consumed today
  const [preWorkout, setPreWorkout] = useState(['Banana']); // Banana is active by default

  // Post-workout recovery shake consumed today
  const [postWorkout, setPostWorkout] = useState(true); // Recovery Shake active by default

  // Water intake in ml
  const [waterIntake, setWaterIntake] = useState(1750); // Starts at 1750ml

  // Fruit intake servings
  const [fruitIntake, setFruitIntake] = useState(1); // Starts at 1 serving

  // Weekly Planner state
  const [planner, setPlanner] = useState(initialPlanner);

  // Calculate current total protein consumed dynamically
  const [currentProtein, setCurrentProtein] = useState(67);

  useEffect(() => {
    let proteinSum = 0;
    // Sum from checklist
    proteinChecklist.forEach(item => {
      if (item.checked) {
        proteinSum += item.protein;
      }
    });
    // Add recovery shake protein (26g)
    if (postWorkout) {
      proteinSum += 26;
    }
    // Add banana (approx 1.5g) or sweet potato (approx 2g) from pre-workout if we want to be precise,
    // but let's keep it simple: checklist + recovery shake.
    // Let's add pre-workout protein if sweet potato or banana is selected:
    preWorkout.forEach(item => {
      if (item === 'Banana') proteinSum += 1.5;
      if (item === 'Sweet Potato') proteinSum += 2.5;
    });

    setCurrentProtein(Math.round(proteinSum * 10) / 10);
  }, [proteinChecklist, postWorkout, preWorkout]);

  // Calculate current carbs consumed today based on checked items & pre-workout
  const [currentCarbs, setCurrentCarbs] = useState(145);
  // Calculate current calories consumed today
  const [currentCalories, setCurrentCalories] = useState(1320);

  useEffect(() => {
    let caloriesSum = 450; // Base baseline
    let carbsSum = 90;

    proteinChecklist.forEach(item => {
      if (item.checked) {
        caloriesSum += item.protein * 4 + 50; // rough estimation
        carbsSum += 5;
      }
    });

    if (postWorkout) {
      caloriesSum += 180;
      carbsSum += 3;
    }

    preWorkout.forEach(item => {
      if (item === 'Banana') {
        caloriesSum += 105;
        carbsSum += 27;
      }
      if (item === 'Sweet Potato') {
        caloriesSum += 130;
        carbsSum += 30;
      }
      if (item === 'Coffee') {
        caloriesSum += 5;
        carbsSum += 0;
      }
    });

    setCurrentCalories(caloriesSum);
    setCurrentCarbs(carbsSum);
  }, [proteinChecklist, postWorkout, preWorkout]);

  // Methods
  const toggleProteinChecklist = (id) => {
    setProteinChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const addCustomProteinItem = (name, proteinValue) => {
    const numericProtein = parseFloat(proteinValue) || 0;
    setProteinChecklist(prev => [
      ...prev,
      {
        id: Date.now(),
        name: `${name} (Custom)`,
        protein: numericProtein,
        checked: true
      }
    ]);
  };

  const deleteProteinItem = (id) => {
    setProteinChecklist(prev => prev.filter(item => item.id !== id));
  };

  const togglePreWorkout = (item) => {
    setPreWorkout(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const adjustWater = (amount) => {
    setWaterIntake(prev => Math.max(0, Math.min(6000, prev + amount)));
  };

  const adjustFruit = (amount) => {
    setFruitIntake(prev => Math.max(0, Math.min(5, prev + amount)));
  };

  const updatePlannerDay = (day, updatedDayData) => {
    setPlanner(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...updatedDayData
      }
    }));
  };

  const updateTargets = (newTargets) => {
    setTargets(prev => ({
      ...prev,
      ...newTargets
    }));
  };

  return (
    <AppContext.Provider value={{
      targets,
      proteinChecklist,
      preWorkout,
      postWorkout,
      waterIntake,
      fruitIntake,
      planner,
      currentProtein,
      currentCarbs,
      currentCalories,
      toggleProteinChecklist,
      addCustomProteinItem,
      deleteProteinItem,
      togglePreWorkout,
      setPostWorkout,
      adjustWater,
      adjustFruit,
      updatePlannerDay,
      updateTargets
    }}>
      {children}
    </AppContext.Provider>
  );
};
