import React, { createContext, useState, useEffect } from 'react';
import { initialPlanner } from '../data/initialPlanner';
import { mealLibrary } from '../data/mealLibrary';
import { 
  db, 
  isFirebaseConfigured, 
  getSavedFirebaseConfig, 
  initializeFirebaseDynamically, 
  testFirebaseConnection,
  checkConfigValidity
} from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Cloud Sync & Custom Firebase config states
  const [syncId, setSyncId] = useState(() => {
    const saved = localStorage.getItem('aura_sync_id');
    if (saved) return saved;
    const newId = `mayur-sync-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('aura_sync_id', newId);
    return newId;
  });

  const [activeConfig, setActiveConfig] = useState(() => {
    return getSavedFirebaseConfig();
  });

  const [currentDb, setCurrentDb] = useState(() => {
    return db;
  });

  const [dbStatus, setDbStatus] = useState(() => {
    return db ? 'connected' : 'local';
  });

  // Configurable targets
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem('aura_targets');
    return saved ? JSON.parse(saved) : {
      calories: 2000,
      protein: 120, // 120g target
      carbs: 250,
      water: 3000, // 3000ml target
    };
  });

  // Checklist of protein sources consumed today
  const [proteinChecklist, setProteinChecklist] = useState(() => {
    const saved = localStorage.getItem('aura_proteinChecklist');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Skimmed Milk (250ml)', protein: 9, checked: true },
      { id: 2, name: 'Low Fat Paneer (100g)', protein: 20, checked: true },
      { id: 3, name: 'Yellow Moong Dal (50g)', protein: 12, checked: true },
      { id: 4, name: 'Artisan Oats Bowl', protein: 18, checked: false },
      { id: 5, name: 'Soya Chunks (50g)', protein: 26, checked: false },
      { id: 6, name: 'Whole Eggs (3)', protein: 18, checked: false },
    ];
  });

  // Pre-workout items consumed today
  const [preWorkout, setPreWorkout] = useState(() => {
    const saved = localStorage.getItem('aura_preWorkout');
    return saved ? JSON.parse(saved) : ['Banana']; // Banana is active by default
  });

  // Post-workout recovery shake consumed today
  const [postWorkout, setPostWorkout] = useState(() => {
    const saved = localStorage.getItem('aura_postWorkout');
    return saved ? JSON.parse(saved) : true; // Recovery Shake active by default
  });

  // Water intake in ml
  const [waterIntake, setWaterIntake] = useState(() => {
    const saved = localStorage.getItem('aura_waterIntake');
    return saved ? JSON.parse(saved) : 1750; // Starts at 1750ml
  });

  // Fruit intake servings
  const [fruitIntake, setFruitIntake] = useState(() => {
    const saved = localStorage.getItem('aura_fruitIntake');
    return saved ? JSON.parse(saved) : 1; // Starts at 1 serving
  });

  // Weekly Planner state
  const [planner, setPlanner] = useState(() => {
    const saved = localStorage.getItem('aura_planner');
    return saved ? JSON.parse(saved) : initialPlanner;
  });

  // Custom meals library additions
  const [customMeals, setCustomMeals] = useState(() => {
    const saved = localStorage.getItem('aura_custom_meals');
    return saved ? JSON.parse(saved) : { breakfast: [], lunch: [], dinner: [] };
  });

  // Unified meals list containing static and custom entries
  const meals = {
    breakfast: [...mealLibrary.breakfast, ...(customMeals.breakfast || [])],
    lunch: [...mealLibrary.lunch, ...(customMeals.lunch || [])],
    dinner: [...mealLibrary.dinner, ...(customMeals.dinner || [])]
  };

  // 1. Mount Effect: Fetch cloud data from Firestore if configured
  useEffect(() => {
    if (!currentDb) {
      setDbStatus('local');
      return;
    }

    const fetchCloudData = async () => {
      setDbStatus('connecting');
      try {
        const docRef = doc(currentDb, "user_data", syncId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.targets) setTargets(data.targets);
          if (data.proteinChecklist) setProteinChecklist(data.proteinChecklist);
          if (data.preWorkout) setPreWorkout(data.preWorkout);
          if (data.postWorkout) setPostWorkout(data.postWorkout);
          if (data.waterIntake) setWaterIntake(data.waterIntake);
          if (data.fruitIntake) setFruitIntake(data.fruitIntake);
          if (data.planner) setPlanner(data.planner);
          if (data.customMeals) setCustomMeals(data.customMeals);
          console.log("✓ Cloud database loaded successfully.");
          setDbStatus('connected');
        } else {
          console.log("No cloud data found. Creating default document in Firestore...");
          await setDoc(docRef, {
            targets,
            proteinChecklist,
            preWorkout,
            postWorkout,
            waterIntake,
            fruitIntake,
            planner,
            customMeals
          });
          setDbStatus('connected');
        }
      } catch (err) {
        console.error("Error reading from Firestore:", err);
        setDbStatus('disconnected');
      }
    };

    fetchCloudData();
  }, [currentDb, syncId]);

  // 2. Sync Effect: Save local states to Firestore & LocalStorage
  useEffect(() => {
    if (currentDb && dbStatus === 'connected') {
      const docRef = doc(currentDb, "user_data", syncId);
      setDoc(docRef, {
        targets,
        proteinChecklist,
        preWorkout,
        postWorkout,
        waterIntake,
        fruitIntake,
        planner,
        customMeals
      }, { merge: true }).catch(err => {
        console.error("Error writing to Firestore:", err);
      });
    }

    // Always backup locally as secondary persistent storage
    localStorage.setItem('aura_targets', JSON.stringify(targets));
    localStorage.setItem('aura_proteinChecklist', JSON.stringify(proteinChecklist));
    localStorage.setItem('aura_preWorkout', JSON.stringify(preWorkout));
    localStorage.setItem('aura_postWorkout', JSON.stringify(postWorkout));
    localStorage.setItem('aura_waterIntake', JSON.stringify(waterIntake));
    localStorage.setItem('aura_fruitIntake', JSON.stringify(fruitIntake));
    localStorage.setItem('aura_planner', JSON.stringify(planner));
    localStorage.setItem('aura_custom_meals', JSON.stringify(customMeals));
    
  }, [targets, proteinChecklist, preWorkout, postWorkout, waterIntake, fruitIntake, planner, customMeals, currentDb, dbStatus, syncId]);

  // Firebase Config actions
  const saveCustomFirebaseConfig = async (config, newSyncId) => {
    const testResult = await testFirebaseConnection(config);
    if (!testResult.success) {
      return testResult;
    }

    localStorage.setItem('aura_custom_firebase_config', JSON.stringify(config));
    localStorage.setItem('aura_sync_id', newSyncId);

    const newDb = initializeFirebaseDynamically(config);
    setActiveConfig(config);
    setSyncId(newSyncId);
    setCurrentDb(newDb);
    
    if (testResult.offline) {
      setDbStatus('disconnected');
      return { 
        success: true, 
        offline: true, 
        message: testResult.message 
      };
    }

    setDbStatus(newDb ? 'connected' : 'local');
    return { success: true };
  };

  const clearFirebaseConfig = () => {
    localStorage.removeItem('aura_custom_firebase_config');
    initializeFirebaseDynamically(null);
    setActiveConfig(null);
    setCurrentDb(null);
    setDbStatus('local');
  };

  const uploadLocalDataToCloud = async () => {
    if (!currentDb) return { success: false, message: "Database not connected." };
    try {
      const docRef = doc(currentDb, "user_data", syncId);
      await setDoc(docRef, {
        targets,
        proteinChecklist,
        preWorkout,
        postWorkout,
        waterIntake,
        fruitIntake,
        planner,
        customMeals
      });
      return { success: true };
    } catch (err) {
      console.error("Error uploading local data:", err);
      return { success: false, message: err.message || "Failed to upload data." };
    }
  };

  const downloadCloudDataToLocal = async () => {
    if (!currentDb) return { success: false, message: "Database not connected." };
    try {
      const docRef = doc(currentDb, "user_data", syncId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.targets) setTargets(data.targets);
        if (data.proteinChecklist) setProteinChecklist(data.proteinChecklist);
        if (data.preWorkout) setPreWorkout(data.preWorkout);
        if (data.postWorkout) setPostWorkout(data.postWorkout);
        if (data.waterIntake) setWaterIntake(data.waterIntake);
        if (data.fruitIntake) setFruitIntake(data.fruitIntake);
        if (data.planner) setPlanner(data.planner);
        if (data.customMeals) setCustomMeals(data.customMeals);
        return { success: true };
      } else {
        return { success: false, message: "No cloud data found for this Sync ID." };
      }
    } catch (err) {
      console.error("Error downloading cloud data:", err);
      return { success: false, message: err.message || "Failed to download data." };
    }
  };

  const addCustomMeal = (category, meal) => {
    setCustomMeals(prev => {
      const updated = {
        ...prev,
        [category]: [...(prev[category] || []), { ...meal, id: `custom-${Date.now()}` }]
      };
      return updated;
    });
  };

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
      syncId,
      setSyncId,
      activeConfig,
      dbStatus,
      meals,
      customMeals,
      addCustomMeal,
      saveCustomFirebaseConfig,
      clearFirebaseConfig,
      uploadLocalDataToCloud,
      downloadCloudDataToLocal,
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
