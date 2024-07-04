import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from './components/ui/card.tsx';
import { AlertCircle, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import Tooltip from './components/Tooltip';
import OtherEntity from './OtherEntity';
import mechChassisData from './data/chassisData.json';
import systemsData from './data/systems.json';
import modulesData from './data/modules.json';
import otherEntitiesData from './data/otherEntities.json';
import { EditableText, StatCounter } from './components/CommonComponents';

const Pilot = ({ pilot, onUpdate, onRemove }) => (
  <Card className="mb-2">
    <CardHeader className="p-2 flex justify-between items-center">
      <EditableText
        value={pilot.name}
        onChange={(newName) => onUpdate({ ...pilot, name: newName })}
      />
      <button onClick={onRemove} className="p-1"><Trash2 size={14} /></button>
    </CardHeader>
    <CardContent className="p-2">
      <StatCounter
        label="HP"
        value={pilot.hp}
        max={pilot.maxHp}
        onChange={(newValue) => onUpdate({ ...pilot, hp: newValue })}
        onMaxChange={(newMax) => onUpdate({ ...pilot, maxHp: newMax })}
      />
      <StatCounter
        label="AP"
        value={pilot.ap}
        max={pilot.maxAp}
        onChange={(newValue) => onUpdate({ ...pilot, ap: newValue })}
        onMaxChange={(newMax) => onUpdate({ ...pilot, maxAp: newMax })}
      />
    </CardContent>
  </Card>
);

const SystemModule = ({ name, data, onConditionChange }) => {
  const [condition, setCondition] = useState('normal');

  const cycleCondition = () => {
    const conditions = ['normal', 'damaged', 'destroyed'];
    const currentIndex = conditions.indexOf(condition);
    const nextCondition = conditions[(currentIndex + 1) % conditions.length];
    setCondition(nextCondition);
    onConditionChange(name, nextCondition);
  };

  const getCardColor = () => {
    switch (condition) {
      case 'damaged':
        return 'bg-yellow-100';
      case 'destroyed':
        return 'bg-red-100';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (condition) {
      case 'damaged':
        return 'text-yellow-500';
      case 'destroyed':
        return 'text-red-500';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <Card className={`mb-1 ${getCardColor()}`}>
      <CardContent className="p-2 text-sm flex justify-between items-center">
        <Tooltip content={
          data ? (
            <div className="space-y-1">
              <p><span className="font-bold">Tech Level:</span> {data.techLevel}</p>
              <p><span className="font-bold">Slots Required:</span> {data.slotsRequired}</p>
              <p><span className="font-bold">Salvage Value:</span> {data.salvageValue}</p>
              {data.range && <p><span className="font-bold">Range:</span> {data.range}</p>}
              {data.damage && <p><span className="font-bold">Damage:</span> {data.damage}</p>}
              {data.traits && <p><span className="font-bold">Traits:</span> {data.traits.join(', ')}</p>}
              <p><span className="font-bold">Description:</span> {data.description}</p>
            </div>
          ) : (
            <p>No data available for {name}</p>
          )
        }>
          {name}
        </Tooltip>
        <AlertCircle
          size={18}
          className={`cursor-pointer ${getIconColor()}`}
          onClick={cycleCondition}
        />
      </CardContent>
    </Card>
  );
};

const Mech = ({ mech, onUpdate, onRemove, onActed, onToggleDisabled }) => {
  const [showDetails, setShowDetails] = useState(false);

  const addPilot = () => {
    const newPilot = { name: "New Pilot", hp: 10, maxHp: 10, ap: 5, maxAp: 5 };
    onUpdate({ ...mech, pilots: [...mech.pilots, newPilot] });
  };

  const updatePilot = (index, updatedPilot) => {
    const newPilots = [...mech.pilots];
    newPilots[index] = updatedPilot;
    onUpdate({ ...mech, pilots: newPilots });
  };

  const removePilot = (index) => {
    const newPilots = mech.pilots.filter((_, i) => i !== index);
    onUpdate({ ...mech, pilots: newPilots });
  };

  const handleConditionChange = (itemName, newCondition) => {
    const updatedSystems = mech.systems.map(system =>
      system === itemName ? { name: system, condition: newCondition } : system
    );
    const updatedModules = mech.modules.map(module =>
      module === itemName ? { name: module, condition: newCondition } : module
    );
    onUpdate({ ...mech, systems: updatedSystems, modules: updatedModules });
  };

  return (
    <Card className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 inline-block align-top mr-2">
      <CardHeader className="p-2 flex justify-between items-center">
        <EditableText
          value={mech.name}
          onChange={(newName) => onUpdate({ ...mech, name: newName })}
        />
        <div className="flex items-center">
          <button onClick={() => onActed(mech.id)} className="p-1 mr-2">
            {mech.hasActed ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
          </button>
          <button onClick={() => onToggleDisabled(mech.id)} className="p-1 mr-2">
            {mech.isDisabled ? <ToggleLeft size={14} className="text-gray-500" /> : <ToggleRight size={14} className="text-blue-500" />}
          </button>
          <button onClick={() => setShowDetails(!showDetails)} className="p-1 mr-2">
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={onRemove} className="p-1"><Trash2 size={14} /></button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <StatCounter
          label="SP"
          value={mech.sp}
          max={mech.maxSp}
          onChange={(newValue) => onUpdate({ ...mech, sp: newValue })}
          onMaxChange={(newMax) => onUpdate({ ...mech, maxSp: newMax })}
        />
        <StatCounter
          label="EP"
          value={mech.ep}
          max={mech.maxEp}
          onChange={(newValue) => onUpdate({ ...mech, ep: newValue })}
          onMaxChange={(newMax) => onUpdate({ ...mech, maxEp: newMax })}
        />
        <StatCounter
          label="Heat"
          value={mech.heat}
          max={mech.maxHeat}
          onChange={(newValue) => onUpdate({ ...mech, heat: newValue })}
          onMaxChange={(newMax) => onUpdate({ ...mech, maxHeat: newMax })}
        />
        {showDetails && (
          <>
            <h4 className="font-bold mt-2 mb-1 text-sm">Pilots:</h4>
            {mech.pilots.map((pilot, index) => (
              <Pilot
                key={index}
                pilot={pilot}
                onUpdate={(updatedPilot) => updatePilot(index, updatedPilot)}
                onRemove={() => removePilot(index)}
              />
            ))}
            <button onClick={addPilot} className="mt-1 p-1 bg-blue-500 text-white rounded flex items-center text-xs">
              <Plus size={12} className="mr-1" /> Add Pilot
            </button>
            {mech.systems && mech.systems.length > 0 && (
              <>
                <h4 className="font-bold mt-2 mb-1 text-sm">Systems:</h4>
                {mech.systems.map((system, index) => {
                  const systemName = typeof system === 'string' ? system : system.name;
                  const systemData = systemsData.systems[systemName];
                  return (
                    <SystemModule
                      key={index}
                      name={systemName}
                      data={systemData}
                      onConditionChange={handleConditionChange}
                    />
                  );
                })}
              </>
            )}

            {mech.modules && mech.modules.length > 0 && (
              <>
                <h4 className="font-bold mt-2 mb-1 text-sm">Modules:</h4>
                {mech.modules.map((module, index) => {
                  const moduleName = typeof module === 'string' ? module : module.name;
                  const moduleData = modulesData.modules[moduleName];
                  return (
                    <SystemModule
                      key={index}
                      name={moduleName}
                      data={moduleData}
                      onConditionChange={handleConditionChange}
                    />
                  );
                })}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [mechs, setMechs] = useState([]);
  const [otherEntities, setOtherEntities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState('');
  const [selectedChassis, setSelectedChassis] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [availablePatterns, setAvailablePatterns] = useState([]);

  const addMech = () => {
    let newMech;
    if (selectedChassis === 'custom') {
      newMech = {
        id: Date.now(),
        name: "New Custom Mech",
        sp: 10, maxSp: 10,
        ep: 5, maxEp: 5,
        heat: 0, maxHeat: 5,
        pilots: [],
        hasActed: false,
        isDisabled: false
      };
    } else {
      const chassisData = mechChassisData.mech_chassis.find(mech => mech.name === selectedChassis);
      const patternData = chassisData.patterns.find(pattern => pattern.name === selectedPattern);
      newMech = {
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
        isDisabled: false
      };
    }
    setMechs([...mechs, newMech]);
    setShowAddModal(false);
    resetSelections();
  };

  const addOtherEntity = () => {
    const categoryData = otherEntitiesData.other_entities.find(cat => cat.category === selectedCategory);
    const entityData = categoryData.entities.find(ent => ent.name === selectedEntity);
    const newEntity = {
      id: Date.now(),
      ...entityData,
      category: selectedCategory,
      sp: entityData.structure_pts,
      maxSp: entityData.structure_pts,
      hp: entityData.hp,
      maxHp: entityData.hp
    };
    setOtherEntities([...otherEntities, newEntity]);
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

  const updateMech = (id, updatedMech) => {
    setMechs(mechs.map(mech => mech.id === id ? updatedMech : mech));
  };

  const updateOtherEntity = (id, updatedEntity) => {
    setOtherEntities(otherEntities.map(entity => entity.id === id ? updatedEntity : entity));
  };

  const removeMech = (id) => {
    setMechs(mechs.filter(mech => mech.id !== id));
  };

  const removeOtherEntity = (id) => {
    setOtherEntities(otherEntities.filter(entity => entity.id !== id));
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

  const handleMechActed = (id) => {
    setMechs(mechs.map(mech =>
      mech.id === id ? { ...mech, hasActed: !mech.hasActed } : mech
    ));

    // Check if all mechs have acted
    const allActed = mechs.every(mech => mech.id === id ? !mech.hasActed : mech.hasActed);
    if (allActed) {
      // Reset all mechs' hasActed property
      setMechs(mechs.map(mech => ({ ...mech, hasActed: false })));
    }
  };

  const toggleMechDisabled = (id) => {
    setMechs(mechs.map(mech =>
      mech.id === id ? { ...mech, isDisabled: !mech.isDisabled } : mech
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Salvage Union Character Tracker</h1>
      <div className="flex flex-wrap -mx-1">
        {mechs.map((mech) => (
          <Mech
            key={mech.id}
            mech={mech}
            onUpdate={(updatedMech) => updateMech(mech.id, updatedMech)}
            onRemove={() => removeMech(mech.id)}
          />
        ))}
        {otherEntities.map((entity) => (
          <OtherEntity
            key={entity.id}
            entity={entity}
            onUpdate={(updatedEntity) => updateOtherEntity(entity.id, updatedEntity)}
            onRemove={() => removeOtherEntity(entity.id)}
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
                onClick={selectedEntityType === 'mech' ? addMech : addOtherEntity}
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
};

export default App;