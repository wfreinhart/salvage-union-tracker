import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './components/ui/card.tsx';
import { EditableText, StatCounter } from './components/CommonComponents';
import { ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import mechChassisData from './data/chassisData.json';
import systemsData from './data/systems.json';
import modulesData from './data/modules.json';
import Tooltip from './components/Tooltip';

const EntityComponent = ({ item, type, isAttached, onAdd, onRemove }) => {
    const renderTooltipContent = () => {
      if (type === 'ability') {
        return (
          <div className="space-y-1">
            <p><span className="font-bold">Description:</span> {item.description}</p>
            {item.range && <p><span className="font-bold">Range:</span> {item.range}</p>}
            {item.damage && <p><span className="font-bold">Damage:</span> {item.damage}</p>}
            {item.traits && <p><span className="font-bold">Traits:</span> {item.traits.join(', ')}</p>}
          </div>
        );
      } else {
        const data = type === 'system' ? systemsData.systems[item.name || item] : modulesData.modules[item.name || item];
        return data ? (
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
          <p>No data available for {item.name || item}</p>
        );
      }
    };
  
    return (
      <Card className="mb-1">
        <CardContent className="p-2 text-sm flex justify-between items-center">
          <Tooltip content={renderTooltipContent()}>
            <span className="flex-grow">{item.name || item}</span>
          </Tooltip>
          {isAttached ? (
            <button
              onClick={() => onRemove(item)}
              className="p-1 bg-red-500 text-white rounded-full"
            >
              <Minus size={14} />
            </button>
          ) : (
            <button
              onClick={() => onAdd(item)}
              className="p-1 bg-green-500 text-white rounded-full"
            >
              <Plus size={14} />
            </button>
          )}
        </CardContent>
      </Card>
    );
  };

const MechBuilder = () => {
  const [selectedChassis, setSelectedChassis] = useState(null);
  const [showChassisSelection, setShowChassisSelection] = useState(false);
  const [customMech, setCustomMech] = useState({
    name: 'Custom Mech',
    systems: [],
    modules: [],
    usedSystemSlots: 0,
    usedModuleSlots: 0,
    totalScrap: 0,
    sp: 0,
    maxSp: 0,
    ep: 0,
    maxEp: 0,
    heat: 0,
    maxHeat: 0,
    systemSlots: 0,
    moduleSlots: 0,
  });

  useEffect(() => {
    if (selectedChassis) {
      setCustomMech(prevMech => ({
        ...prevMech,
        sp: selectedChassis.stats.structure_pts,
        maxSp: selectedChassis.stats.structure_pts,
        ep: selectedChassis.stats.energy_pts,
        maxEp: selectedChassis.stats.energy_pts,
        heat: 0,
        maxHeat: selectedChassis.stats.heat_cap,
        systemSlots: selectedChassis.stats.system_slots,
        moduleSlots: selectedChassis.stats.module_slots,
        totalScrap: selectedChassis.stats.salvage_value,
        usedSystemSlots: 0,
        usedModuleSlots: 0,
        systems: [],
        modules: [],
      }));
    }
  }, [selectedChassis]);

  
  const addSystem = (system) => {
    if (customMech.usedSystemSlots + system.slotsRequired <= customMech.systemSlots) {
      setCustomMech(prevMech => ({
        ...prevMech,
        systems: [...prevMech.systems, system],
        usedSystemSlots: prevMech.usedSystemSlots + system.slotsRequired,
        totalScrap: prevMech.totalScrap + system.salvageValue,
      }));
    }
  };

  const addModule = (module) => {
    if (customMech.usedModuleSlots + module.slotsRequired <= customMech.moduleSlots) {
      setCustomMech(prevMech => ({
        ...prevMech,
        modules: [...prevMech.modules, module],
        usedModuleSlots: prevMech.usedModuleSlots + module.slotsRequired,
        totalScrap: prevMech.totalScrap + module.salvageValue,
      }));
    }
  };

  const removeSystem = (index) => {
    const removedSystem = customMech.systems[index];
    setCustomMech(prevMech => ({
      ...prevMech,
      systems: prevMech.systems.filter((_, i) => i !== index),
      usedSystemSlots: prevMech.usedSystemSlots - removedSystem.slotsRequired,
      totalScrap: prevMech.totalScrap - removedSystem.salvageValue,
    }));
  };

  const removeModule = (index) => {
    const removedModule = customMech.modules[index];
    setCustomMech(prevMech => ({
      ...prevMech,
      modules: prevMech.modules.filter((_, i) => i !== index),
      usedModuleSlots: prevMech.usedModuleSlots - removedModule.slotsRequired,
      totalScrap: prevMech.totalScrap - removedModule.salvageValue,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Mech Builder</h2>
      
      <div className="mb-4">
        <button
          onClick={() => setShowChassisSelection(!showChassisSelection)}
          className="p-2 bg-blue-500 text-white rounded flex items-center"
        >
          {selectedChassis ? selectedChassis.name : "Select Chassis"}
          {showChassisSelection ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
        </button>
        
        {showChassisSelection && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {mechChassisData.mech_chassis.map((chassis) => (
              <button
                key={chassis.name}
                onClick={() => {
                  setSelectedChassis(chassis);
                  setShowChassisSelection(false);
                }}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                {chassis.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedChassis && (
        <Card className="mb-4">
          <CardHeader>
            <EditableText
              value={customMech.name}
              onChange={(newName) => setCustomMech(prevMech => ({ ...prevMech, name: newName }))}
            />
          </CardHeader>
          <CardContent>
            <StatCounter label="SP" value={customMech.sp} max={customMech.maxSp} />
            <StatCounter label="EP" value={customMech.ep} max={customMech.maxEp} />
            <StatCounter label="Heat" value={customMech.heat} max={customMech.maxHeat} />
            <p>System Slots: {customMech.usedSystemSlots}/{customMech.systemSlots}</p>
            <p>Module Slots: {customMech.usedModuleSlots}/{customMech.moduleSlots}</p>
            <p>Total Scrap: {customMech.totalScrap}</p>

            <h3 className="font-bold mt-4 mb-2">Installed Systems:</h3>
            <div className="grid grid-cols-2 gap-2">
            {customMech.systems.map((system, index) => (
  <EntityComponent
    key={index}
    item={system}
    type="system"
    isAttached={true}
    onRemove={() => removeSystem(index)}
  />
))}
            </div>

            <h3 className="font-bold mt-4 mb-2">Installed Modules:</h3>
            <div className="grid grid-cols-2 gap-2">
            {customMech.modules.map((module, index) => (
    <EntityComponent
      key={index}
      item={module}
      type="module"
      isAttached={true}
      onRemove={() => removeModule(index)}
    />
  ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Available Systems:</h3>
          <div className="space-y-2">
          {Object.entries(systemsData.systems).map(([name, system]) => (
  <EntityComponent
    key={name}
    item={{ name, ...system }}
    type="system"
    isAttached={false}
    onAdd={() => addSystem({ name, ...system })}
  />
))}
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">Available Modules:</h3>
          <div className="space-y-2">
          {Object.entries(modulesData.modules).map(([name, module]) => (
    <EntityComponent
      key={name}
      item={{ name, ...module }}
      type="module"
      isAttached={false}
      onAdd={() => addModule({ name, ...module })}
    />
  ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechBuilder;