// CommonComponents.js
import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

export const EditableText = ({ value, onChange }) => {
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

export const StatCounter = ({ label, value, max, onChange, onMaxChange }) => (
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