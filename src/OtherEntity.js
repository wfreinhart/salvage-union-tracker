// OtherEntity.js
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './components/ui/card.tsx';
import { AlertCircle, Check, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import Tooltip from './components/Tooltip';
import { EditableText, StatCounter } from './components/CommonComponents';

const Ability = ({ ability }) => (
  <Card className="mb-1">
    <CardContent className="p-2 text-sm flex justify-between items-center">
      <Tooltip content={
        <div className="space-y-1">
          <p><span className="font-bold">Description:</span> {ability.description}</p>
          {ability.range && <p><span className="font-bold">Range:</span> {ability.range}</p>}
          {ability.damage && <p><span className="font-bold">Damage:</span> {ability.damage}</p>}
          {ability.traits && <p><span className="font-bold">Traits:</span> {ability.traits.join(', ')}</p>}
        </div>
      }>
        {ability.name}
      </Tooltip>
    </CardContent>
  </Card>
);

const System = ({ system }) => (
  <Card className="mb-1">
    <CardContent className="p-2 text-sm flex justify-between items-center">
      <Tooltip content={
        <div className="space-y-1">
          {typeof system !== 'string' && (
            <>
              {system.range && <p><span className="font-bold">Range:</span> {system.range}</p>}
              {system.damage && <p><span className="font-bold">Damage:</span> {system.damage}</p>}
              {system.traits && <p><span className="font-bold">Traits:</span> {system.traits.join(', ')}</p>}
            </>
          )}
        </div>
      }>
        {typeof system === 'string' ? system : system.name}
      </Tooltip>
    </CardContent>
  </Card>
);

const OtherEntity = ({ entity, onUpdate, onRemove, onActed, onToggleDisabled }) => {
  const [showDetails, setShowDetails] = useState(false);

  const updateEntityField = (field, value) => {
    onUpdate({ ...entity, [field]: value });
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
        <p className="text-sm mb-2">{entity.description}</p>
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
        {showDetails && (
          <>
            {entity.abilities && (
              <div className="mt-2">
                <h3 className="font-bold text-sm mb-1">Abilities:</h3>
                {entity.abilities.map((ability, index) => (
                  <Ability key={index} ability={ability} />
                ))}
              </div>
            )}
            {entity.systems && (
              <div className="mt-2">
                <h3 className="font-bold text-sm mb-1">Systems:</h3>
                {entity.systems.map((system, index) => (
                  <System key={index} system={system} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OtherEntity;