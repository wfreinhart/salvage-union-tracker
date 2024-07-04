// Ability.js
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card.tsx';
import { AlertCircle } from 'lucide-react';
import Tooltip from './Tooltip';

const Ability = ({ ability, onConditionChange }) => {
  const [condition, setCondition] = useState('normal');

  const cycleCondition = () => {
    const conditions = ['normal', 'damaged', 'destroyed'];
    const currentIndex = conditions.indexOf(condition);
    const nextCondition = conditions[(currentIndex + 1) % conditions.length];
    setCondition(nextCondition);
    onConditionChange(ability.name, nextCondition);
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
        <AlertCircle
          size={18}
          className={`cursor-pointer ${getIconColor()}`}
          onClick={cycleCondition}
        />
      </CardContent>
    </Card>
  );
};

export default Ability;