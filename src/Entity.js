// Entity.js
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './components/ui/card.tsx';
import { AlertCircle, Check, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { EditableText, StatCounter } from './components/CommonComponents';
import Tooltip from './components/Tooltip';
import systemsData from './data/systems.json';
import modulesData from './data/modules.json';

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

const EntityComponent = ({ item, type, onConditionChange }) => {
  const condition = item.condition || 'normal';
  const name = typeof item === 'string' ? item : item.name;

  const cycleCondition = () => {
    const conditions = ['normal', 'damaged', 'destroyed'];
    const currentIndex = conditions.indexOf(condition);
    const nextCondition = conditions[(currentIndex + 1) % conditions.length];
    onConditionChange(nextCondition);
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
    <Card className={`mb-1 ${getCardColor()}`}>
      <CardContent className="p-2 text-sm flex justify-between items-center">
        <Tooltip content={renderTooltipContent()}>
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

const Entity = ({ entity, onUpdate, onUpdateComponent, onRemove, onActed, onToggleDisabled }) => {
  const [showDetails, setShowDetails] = useState(false);

  const updateEntityField = (field, value) => {
    onUpdate({ ...entity, [field]: value });
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
    onUpdate({ ...entity, [type]: updatedItems });
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
          <button onClick={onRemove} className="p-1"><Trash2 size={14} /></button>
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
                  <EntityComponent
                    key={index}
                    item={system}
                    type="system"
                    onConditionChange={(condition) => handleConditionChange('systems', index, condition)}
                  />
                ))}
              </>
            )}

            {entity.modules && entity.modules.length > 0 && (
              <>
                <h4 className="font-bold mt-2 mb-1 text-sm">Modules:</h4>
                {entity.modules.map((module, index) => (
                  <EntityComponent
                    key={index}
                    item={module}
                    type="module"
                    onConditionChange={(condition) => handleConditionChange('modules', index, condition)}
                  />
                ))}
              </>
            )}

            {entity.abilities && entity.abilities.length > 0 && (
              <>
                <h4 className="font-bold mt-2 mb-1 text-sm">Abilities:</h4>
                {entity.abilities.map((ability, index) => (
                  <EntityComponent
                    key={index}
                    item={ability}
                    type="ability"
                    onConditionChange={(condition) => handleConditionChange('abilities', index, condition)}
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