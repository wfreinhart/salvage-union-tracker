import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from './components/ui/card.tsx';
import { AlertCircle, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import Tooltip from './components/Tooltip';
import mechChassisData from './data/chassisData.json';
import systemsData from './data/systems.json';
import modulesData from './data/modules.json';

const EditableText = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleBlur = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleBlur}
      onKeyPress={(e) => e.key === 'Enter' && handleBlur()}
      className="w-full p-1 border rounded text-sm"
      autoFocus
    />
  ) : (
    <span onClick={() => setIsEditing(true)} className="cursor-pointer hover:bg-gray-200 p-1 rounded text-sm">
      {value}
    </span>
  );
};

const StatCounter = ({ label, value, max, onChange, onMaxChange }) => (
  <div className="flex items-center justify-between mb-1 text-sm">
    <span className="mr-1 w-8">{label}:</span>
    <div className="flex items-center">
      <button onClick={() => onChange(Math.max(0, value - 1))} className="p-1">
        <MinusCircle size={14} />
      </button>
      <span className="mx-1">{value}/</span>
      <EditableText
        value={max.toString()}
        onChange={(newMax) => onMaxChange(parseInt(newMax) || 0)}
      />
      <button onClick={() => onChange(Math.min(max, value + 1))} className="p-1">
        <PlusCircle size={14} />
      </button>
    </div>
  </div>
);

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
  const [showAddMechModal, setShowAddMechModal] = useState(false);
  const [selectedChassis, setSelectedChassis] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');

  const addMech = () => {
    let newMech;
    if (selectedChassis === 'custom') {
      newMech = {
        id: Date.now(), // Add a unique id
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
        id: Date.now(), // Add a unique id
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
    setShowAddMechModal(false);
    setSelectedChassis('');
    setSelectedPattern('');
  };

  const updateMech = (id, updatedMech) => {
    setMechs(mechs.map(mech => mech.id === id ? updatedMech : mech));
  };

  const removeMech = (id) => {
    setMechs(mechs.filter(mech => mech.id !== id));
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
            onActed={handleMechActed}
            onToggleDisabled={toggleMechDisabled}
          />
        ))}
      </div>
      <button onClick={() => setShowAddMechModal(true)} className="mt-4 p-2 bg-green-500 text-white rounded flex items-center text-sm">
        <Plus size={16} className="mr-1" /> Add Mech/Vehicle
      </button>

      {showAddMechModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Select Mech Chassis</h2>
            <select
              value={selectedChassis}
              onChange={(e) => {
                setSelectedChassis(e.target.value);
                setSelectedPattern('');
              }}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">Select a chassis</option>
              {mechChassisData.mech_chassis.map((chassis) => (
                <option key={chassis.name} value={chassis.name}>{chassis.name}</option>
              ))}
              <option value="custom">Custom Mech</option>
            </select>
            {selectedChassis && selectedChassis !== 'custom' && (
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="">Select a pattern</option>
                {mechChassisData.mech_chassis
                  .find(chassis => chassis.name === selectedChassis)
                  .patterns.map((pattern) => (
                    <option key={pattern.name} value={pattern.name}>{pattern.name}</option>
                  ))
                }
              </select>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddMechModal(false)}
                className="mr-2 p-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addMech}
                className="p-2 bg-blue-500 text-white rounded"
                disabled={!selectedChassis || (selectedChassis !== 'custom' && !selectedPattern)}
              >
                Add Mech
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;