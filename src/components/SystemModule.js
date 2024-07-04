import React, { useState } from 'react';
import { Card, CardContent } from './ui/card.tsx';
import { AlertCircle } from 'lucide-react';
import Tooltip from './Tooltip';

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

export default SystemModule;