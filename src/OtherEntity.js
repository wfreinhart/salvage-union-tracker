// OtherEntity.js
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './components/ui/card.tsx';
import { AlertCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import Tooltip from './components/Tooltip';
import { EditableText, StatCounter } from './components/CommonComponents';

const Ability = ({ ability }) => (
  <div className="mb-2">
    <h4 className="font-bold text-sm">{ability.name}</h4>
    <p className="text-xs">{ability.description}</p>
    {ability.range && <p className="text-xs">Range: {ability.range}</p>}
    {ability.damage && <p className="text-xs">Damage: {ability.damage}</p>}
    {ability.traits && <p className="text-xs">Traits: {ability.traits.join(', ')}</p>}
  </div>
);

const System = ({ system }) => (
  <div className="mb-2">
    <h4 className="font-bold text-sm">{typeof system === 'string' ? system : system.name}</h4>
    {typeof system !== 'string' && (
      <>
        {system.range && <p className="text-xs">Range: {system.range}</p>}
        {system.damage && <p className="text-xs">Damage: {system.damage}</p>}
        {system.traits && <p className="text-xs">Traits: {system.traits.join(', ')}</p>}
      </>
    )}
  </div>
);

const OtherEntity = ({ entity, onUpdate, onRemove }) => {
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