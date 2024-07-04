import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card.tsx';
import { Trash2 } from 'lucide-react';
import { EditableText, StatCounter } from './CommonComponents';

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

export default Pilot;