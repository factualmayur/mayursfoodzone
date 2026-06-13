import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { MealLibrary } from './pages/MealLibrary';
import { FoodLibrary } from './pages/FoodLibrary';
import { WeeklyPlanner } from './pages/WeeklyPlanner';
import { QuantityCalculator } from './pages/QuantityCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'meals':
        return <MealLibrary />;
      case 'foods':
        return <FoodLibrary />;
      case 'planner':
        return <WeeklyPlanner />;
      case 'calculator':
        return <QuantityCalculator />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0F1117] text-white flex flex-col md:flex-row relative overflow-x-hidden">
        
        {/* Navigation Sidebar/Dock */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-8 pt-4 pb-28 md:pb-8 md:pl-[290px] min-h-screen overflow-y-auto">
          {/* Subtle Ambient Decorative Glowing Orbs */}
          <div className="absolute top-24 left-[30%] w-72 h-72 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-24 right-[10%] w-96 h-96 rounded-full bg-luxuryGold/5 blur-[150px] pointer-events-none" />
          <div className="absolute top-1/2 left-[60%] w-80 h-80 rounded-full bg-luxuryRose/5 blur-[130px] pointer-events-none" />

          {/* Render Active Page Container */}
          <div className="max-w-7xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              {renderActivePage()}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
