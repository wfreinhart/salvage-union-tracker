import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card.tsx';
import { AlertCircle, Check, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { EditableText, StatCounter } from './CommonComponents';
import Tooltip from './Tooltip';
import Pilot from './Pilot';
import SystemModule from './SystemModule';
import Ability from './Ability';
import systemsData from '../data/systems.json';
import modulesData from '../data/modules.json';

const Entity = ({ entity, onUpdate, onRemove, onActed, onToggleDisabled }) => {
  const [showDetails, setShowDetails] = useState(false);

  const updateEntityField = (field, value) => {
    onUpdate(entity.id, { ...entity, [field]: value });
  };

  const addPilot = () => {
    const newPilot = { name: "New Pilot", hp: 10, maxHp: 10, ap: 5, maxAp: 5 };
    updateEntityField('pilots', [...(entity.pilots || []), newPilot]);
  };

  const updatePilot = (index, updatedPilot) => {
    const newPilots = [...entity.pilots];
    newPilots[index] = updatedPilot;
    updateEntityField('pilots', newPilots);
  };

  const removePilot = (index) => {
    const newPilots = entity.pilots.filter((_, i) => i !== index);
    updateEntityField('pilots', newPilots);
  };

  const handleConditionChange = (type, index, newCondition) => {
    const updatedItems = [...entity[type]];
    if (typeof updatedItems[index] === 'string') {
      updatedItems[index] = { name: updatedItems[index], condition: newCondition };
    } else {
      updatedItems[index] = { ...updatedItems[index], condition: newCondition };
    }
    updateEntityField(type, updatedItems);
  };

  const getSystemData = (systemName) => {
    return systemsData.systems[systemName] || null;
  };

  const getModuleData = (moduleName) => {
    return modulesData.modules[moduleName] || null;
  };

  return (
    <Card className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 inline-block align-top mr-2">
      <CardHeader className="p-2 flex justify-between items-center">
        <EditableText
          value={entity.name}
          onChange={(newName) => updateEntityField('name', newName)}
        />
        <div className="flex items-center">
          <button onClick={() => onActed(entity.id)} className="p-1 mr-2">
            {entity.hasActed ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
          </button>
          <button onClick={() => onToggleDisabled(entity.id)} className="p-1 mr-2">
            {entity.isDisabled ? <ToggleLeft size={14} className="text-gray-500" /> : <ToggleRight size={14} className="text-blue-500" />}
          </button>
          <button onClick={() => setShowDetails(!showDetails)} className="p-1 mr-2">
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onRemove(entity.id)} className="p-1"><Trash2 size={14} /></button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        {entity.description && <p className="text-sm mb-2">{entity.description}</p>}
        {entity.sp !== undefined ? (
          <StatCounter
            label="SP"
            value={entity.sp}
            max={entity.maxSp}
            onChange={(newValue) => updateEntityField('sp', newValue)}
            onMaxChange={(newMax) => updateEntityField('maxSp', newMax)}
          />
        ) : (
          <StatCounter
            label="HP"
            value={entity.hp}
            max={entity.maxHp}
            onChange={(newValue) => updateEntityField('hp', newValue)}
            onMaxChange={(newMax) => updateEntityField('maxHp', newMax)}
          />
        )}
        {entity.ep !== undefined && (
          <StatCounter
            label="EP"
            value={entity.ep}
            max={entity.maxEp}
            onChange={(newValue) => updateEntityField('ep', newValue)}
            onMaxChange={(newMax) => updateEntityField('maxEp', newMax)}
          />
        )}
        {entity.heat !== undefined && (
          <StatCounter
            label="Heat"
            value={entity.heat}
            max={entity.maxHeat}
            onChange={(newValue) => updateEntityField('heat', newValue)}
            onMaxChange={(newMax) => updateEntityField('maxHeat', newMax)}
          />
        )}
        {showDetails && (
          <>
            {entity.pilots && (
              <>
                <h4 className="font-bold mt-2 mb-1 text-sm">Pilots:</h4>
                {entity.pilots.map((pilot, index) => (
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
              </>
            )}
            
            {entity.systems && entity.systems.length > 0 && (
            <>
              <h4 className="font-bold mt-2 mb-1 text-sm">Systems:</h4>
              {entity.systems.map((system, index) => (
                <SystemModule
                  key={index}
                  name={typeof system === 'string' ? system : system.name}
                  data={getSystemData(typeof system === 'string' ? system : system.name)}
                  onConditionChange={(name, condition) => handleConditionChange('systems', index, condition)}
                />
              ))}
            </>
          )}

{entity.modules && entity.modules.length > 0 && (
            <>
              <h4 className="font-bold mt-2 mb-1 text-sm">Modules:</h4>
              {entity.modules.map((module, index) => (
                <SystemModule
                  key={index}
                  name={typeof module === 'string' ? module : module.name}
                  data={getModuleData(typeof module === 'string' ? module : module.name)}
                  onConditionChange={(name, condition) => handleConditionChange('modules', index, condition)}
                />
              ))}
            </>
          )}

{entity.abilities && entity.abilities.length > 0 && (
            <>
              <h4 className="font-bold mt-2 mb-1 text-sm">Abilities:</h4>
              {entity.abilities.map((ability, index) => (
                <Ability 
                  key={index} 
                  ability={ability}
                  onConditionChange={(name, condition) => handleConditionChange('abilities', index, condition)}
                />
              ))}
            </>
          )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Entity;