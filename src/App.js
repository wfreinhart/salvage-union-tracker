// App.js
import React, { useState, useEffect } from 'react';
import CombatTracker from './CombatTracker';
import MechBuilder from './MechBuilder';

const App = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'combat';
  });

  const [combatEntities, setCombatEntities] = useState(() => {
    const savedEntities = localStorage.getItem('combatEntities');
    return savedEntities ? JSON.parse(savedEntities) : [];
  });

  const [customMechPatterns, setCustomMechPatterns] = useState(() => {
    const savedPatterns = localStorage.getItem('customMechPatterns');
    return savedPatterns ? JSON.parse(savedPatterns) : [];
  });

  // Add this useEffect to persist customMechPatterns
  useEffect(() => {
    localStorage.setItem('customMechPatterns', JSON.stringify(customMechPatterns));
  }, [customMechPatterns]);

  // Modify the saveCustomMechPattern function
  const saveCustomMechPattern = (mechPattern) => {
    setCustomMechPatterns(prevPatterns => {
      const existingPatternIndex = prevPatterns.findIndex(p => p.name === mechPattern.name);
      if (existingPatternIndex !== -1) {
        // Update existing pattern
        const updatedPatterns = [...prevPatterns];
        updatedPatterns[existingPatternIndex] = {
          ...updatedPatterns[existingPatternIndex],
          ...mechPattern,
          id: updatedPatterns[existingPatternIndex].id // Preserve the original ID
        };
        updateCombatEntitiesFromPattern(updatedPatterns[existingPatternIndex]);
        return updatedPatterns;
      } else {
        // Add new pattern
        const newPattern = { ...mechPattern, id: Date.now().toString() };
        return [...prevPatterns, newPattern];
      }
    });
  };

  // Handle activeTab persistence
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Handle combatEntities persistence
  useEffect(() => {
    localStorage.setItem('combatEntities', JSON.stringify(combatEntities));
  }, [combatEntities]);

  // Handle customMechPatterns persistence
  useEffect(() => {
    localStorage.setItem('customMechPatterns', JSON.stringify(customMechPatterns));
  }, [customMechPatterns]);

  const deleteCustomMechPattern = (patternName) => {
    setCustomMechPatterns(prevPatterns => prevPatterns.filter(p => p.name !== patternName));
  };

  const updateCombatEntitiesFromPattern = (updatedPattern) => {
    setCombatEntities(prevEntities =>
      prevEntities.map(entity => {
        if (entity.patternId === updatedPattern.id) {
          return {
            ...entity,
            ...updatedPattern,
            id: entity.id, // Preserve the entity's unique ID
            pilots: entity.pilots,
            hasActed: entity.hasActed,
            isDisabled: entity.isDisabled,
            groupColor: entity.groupColor,
            type: entity.type
          };
        }
        return entity;
      })
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Salvage Union Character Tracker</h1>

      <div className="mb-4">
        <button
          onClick={() => setActiveTab('combat')}
          className={`mr-2 p-2 ${activeTab === 'combat' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
        >
          Combat Tracker
        </button>
        <button
          onClick={() => setActiveTab('mechBuilder')}
          className={`p-2 ${activeTab === 'mechBuilder' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
        >
          Mech Builder
        </button>
      </div>

      {activeTab === 'combat' && (
        <CombatTracker
          customMechPatterns={customMechPatterns}
          entities={combatEntities}
          setEntities={setCombatEntities}
        />
      )}

      {activeTab === 'mechBuilder' && (
        <MechBuilder
          saveCustomMechPattern={saveCustomMechPattern}
          customMechPatterns={customMechPatterns}
          deleteCustomMechPattern={deleteCustomMechPattern}
          updateCombatEntitiesFromPattern={updateCombatEntitiesFromPattern}
        />
      )}
    </div>
  );
}

export default App;