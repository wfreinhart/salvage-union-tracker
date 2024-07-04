// App.js
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Entity from './Entity';
import mechChassisData from './data/chassisData.json';
import otherEntitiesData from './data/otherEntities.json';

const App = () => {
  const [entities, setEntities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState('');
  const [selectedChassis, setSelectedChassis] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [availablePatterns, setAvailablePatterns] = useState([]);

  const addEntity = () => {
    let newEntity;
    if (selectedEntityType === 'mech') {
      if (selectedChassis === 'custom') {
        newEntity = {
          id: Date.now(),
          name: "New Custom Mech",
          sp: 10, maxSp: 10,
          ep: 5, maxEp: 5,
          heat: 0, maxHeat: 5,
          pilots: [],
          hasActed: false,
          isDisabled: false,
          type: 'mech'
        };
      } else {
        const chassisData = mechChassisData.mech_chassis.find(mech => mech.name === selectedChassis);
        const patternData = chassisData.patterns.find(pattern => pattern.name === selectedPattern);
        newEntity = {
          id: Date.now(),
          name: `${selectedChassis} - ${selectedPattern}`,
          sp: chassisData.stats.structure_pts,
          maxSp: chassisData.stats.structure_pts,
          ep: chassisData.stats.energy_pts,
          maxEp: chassisData.stats.energy_pts,
          heat: 0,
          maxHeat: chassisData.stats.heat_cap,
          pilots: [],
          systems: patternData.systems,
          modules: patternData.modules,
          hasActed: false,
          isDisabled: false,
          type: 'mech'
        };
      }
    } else {
      const categoryData = otherEntitiesData.other_entities.find(cat => cat.category === selectedCategory);
      const entityData = categoryData.entities.find(ent => ent.name === selectedEntity);
      newEntity = {
        id: Date.now(),
        ...entityData,
        category: selectedCategory,
        sp: entityData.structure_pts,
        maxSp: entityData.structure_pts,
        hp: entityData.hp,
        maxHp: entityData.hp,
        hasActed: false,
        isDisabled: false,
        type: 'other'
      };
    }
    setEntities([...entities, newEntity]);
    setShowAddModal(false);
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedEntityType('');
    setSelectedChassis('');
    setSelectedPattern('');
    setSelectedCategory('');
    setSelectedEntity('');
  };

  const selectChassis = (chassisName) => {
    setSelectedChassis(chassisName);
    if (chassisName === 'custom') {
      setAvailablePatterns([]);
    } else {
      const chassis = mechChassisData.mech_chassis.find(mech => mech.name === chassisName);
      setAvailablePatterns(chassis ? chassis.patterns.map(p => p.name) : []);
    }
    setSelectedPattern('');
  };

  const selectPattern = (patternName) => {
    setSelectedPattern(patternName);
  };

  const updateEntity = (id, updatedEntity) => {
    setEntities(entities.map(entity => entity.id === id ? updatedEntity : entity));
  };

  const removeEntity = (id) => {
    setEntities(entities.filter(entity => entity.id !== id));
  };

  const handleEntityActed = (id) => {
    let updatedEntities = entities.map(entity =>
      entity.id === id ? { ...entity, hasActed: !entity.hasActed } : entity
    );

    const allActed = updatedEntities.every(entity => entity.hasActed);
    if (allActed) {
      updatedEntities = updatedEntities.map(entity => ({ ...entity, hasActed: false }));
    }

    setEntities(updatedEntities);
  };

  const toggleEntityDisabled = (id) => {
    setEntities(entities.map(entity =>
      entity.id === id ? { ...entity, isDisabled: !entity.isDisabled } : entity
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Salvage Union Character Tracker</h1>
      <div className="flex flex-wrap -mx-1">
        {entities.map((entity) => (
          <Entity
            key={entity.id}
            entity={entity}
            onUpdate={(updatedEntity) => updateEntity(entity.id, updatedEntity)}
            onRemove={() => removeEntity(entity.id)}
            onActed={() => handleEntityActed(entity.id)}
            onToggleDisabled={() => toggleEntityDisabled(entity.id)}
          />
        ))}
      </div>
      <button onClick={() => setShowAddModal(true)} className="mt-4 p-2 bg-green-500 text-white rounded flex items-center text-sm">
        <Plus size={16} className="mr-1" /> Add Entity
      </button>
  
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-2">Add New Entity</h2>
            <div className="mb-4">
              <button
                onClick={() => setSelectedEntityType('mech')}
                className={`mr-2 p-2 ${selectedEntityType === 'mech' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
              >
                Mech
              </button>
              <button
                onClick={() => setSelectedEntityType('other')}
                className={`p-2 ${selectedEntityType === 'other' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
              >
                Other Entity
              </button>
            </div>
  
            {selectedEntityType === 'mech' && (
              <>
                <h3 className="font-bold mb-2">Select Chassis:</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {mechChassisData.mech_chassis.map((chassis) => (
                    <button
                      key={chassis.name}
                      onClick={() => selectChassis(chassis.name)}
                      className={`p-2 ${selectedChassis === chassis.name ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                    >
                      {chassis.name}
                    </button>
                  ))}
                  <button
                    onClick={() => selectChassis('custom')}
                    className={`p-2 ${selectedChassis === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                  >
                    Custom Mech
                  </button>
                </div>
  
                {selectedChassis && selectedChassis !== 'custom' && (
                  <>
                    <h3 className="font-bold mb-2">Select Pattern:</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {availablePatterns.map((pattern) => (
                        <button
                          key={pattern}
                          onClick={() => selectPattern(pattern)}
                          className={`p-2 ${selectedPattern === pattern ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                        >
                          {pattern}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
  
            {selectedEntityType === 'other' && (
              <>
                <h3 className="font-bold mb-2">Select Category:</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {otherEntitiesData.other_entities.map((category) => (
                    <button
                      key={category.category}
                      onClick={() => {
                        setSelectedCategory(category.category);
                        setSelectedEntity('');
                      }}
                      className={`p-2 ${selectedCategory === category.category ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                    >
                      {category.category}
                    </button>
                  ))}
                </div>
  
                {selectedCategory && (
                  <>
                    <h3 className="font-bold mb-2">Select Entity:</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {otherEntitiesData.other_entities
                        .find(cat => cat.category === selectedCategory)
                        ?.entities.map((entity) => (
                          <button
                            key={entity.name}
                            onClick={() => setSelectedEntity(entity.name)}
                            className={`p-2 ${selectedEntity === entity.name ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                          >
                            {entity.name}
                          </button>
                        ))
                      }
                    </div>
                  </>
                )}
              </>
            )}
  
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="mr-2 p-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addEntity}
                className="p-2 bg-blue-500 text-white rounded"
                disabled={
                  (selectedEntityType === 'mech' && (!selectedChassis || (selectedChassis !== 'custom' && !selectedPattern))) ||
                  (selectedEntityType === 'other' && (!selectedCategory || !selectedEntity))
                }
              >
                Add Entity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;