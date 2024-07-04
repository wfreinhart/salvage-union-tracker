import React, { useState, useEffect } from 'react';
import mechChassisData from '../data/chassisData.json';
import otherEntitiesData from '../data/otherEntities.json';

const AddEntityModal = ({ onClose, onAddEntity }) => {
  const [entityType, setEntityType] = useState('');
  const [chassis, setChassis] = useState('');
  const [pattern, setPattern] = useState('');
  const [category, setCategory] = useState('');
  const [entity, setEntity] = useState('');
  const [availablePatterns, setAvailablePatterns] = useState([]);

  useEffect(() => {
    if (chassis && chassis !== 'custom') {
      const selectedChassis = mechChassisData.mech_chassis.find(mech => mech.name === chassis);
      setAvailablePatterns(selectedChassis ? selectedChassis.patterns.map(p => p.name) : []);
    } else {
      setAvailablePatterns([]);
    }
    setPattern('');
  }, [chassis]);

  const handleAddEntity = () => {
    onAddEntity({ entityType, chassis, pattern, category, entity });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg max-w-lg w-full">
        <h2 className="text-lg font-bold mb-2">Add New Entity</h2>
        <div className="mb-4">
          <button
            onClick={() => setEntityType('mech')}
            className={`mr-2 p-2 ${entityType === 'mech' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          >
            Mech
          </button>
          <button
            onClick={() => setEntityType('other')}
            className={`p-2 ${entityType === 'other' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          >
            Other Entity
          </button>
        </div>

        {entityType === 'mech' && (
          <>
            <h3 className="font-bold mb-2">Select Chassis:</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {mechChassisData.mech_chassis.map((chassisOption) => (
                <button
                  key={chassisOption.name}
                  onClick={() => setChassis(chassisOption.name)}
                  className={`p-2 ${chassis === chassisOption.name ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                >
                  {chassisOption.name}
                </button>
              ))}
              <button
                onClick={() => setChassis('custom')}
                className={`p-2 ${chassis === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
              >
                Custom Mech
              </button>
            </div>

            {chassis && chassis !== 'custom' && (
              <>
                <h3 className="font-bold mb-2">Select Pattern:</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {availablePatterns.map((patternOption) => (
                    <button
                      key={patternOption}
                      onClick={() => setPattern(patternOption)}
                      className={`p-2 ${pattern === patternOption ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                    >
                      {patternOption}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {entityType === 'other' && (
          <>
            <h3 className="font-bold mb-2">Select Category:</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {otherEntitiesData.other_entities.map((categoryOption) => (
                <button
                  key={categoryOption.category}
                  onClick={() => {
                    setCategory(categoryOption.category);
                    setEntity('');
                  }}
                  className={`p-2 ${category === categoryOption.category ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                >
                  {categoryOption.category}
                </button>
              ))}
            </div>

            {category && (
              <>
                <h3 className="font-bold mb-2">Select Entity:</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {otherEntitiesData.other_entities
                    .find(cat => cat.category === category)
                    ?.entities.map((entityOption) => (
                      <button
                        key={entityOption.name}
                        onClick={() => setEntity(entityOption.name)}
                        className={`p-2 ${entity === entityOption.name ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                      >
                        {entityOption.name}
                      </button>
                    ))
                  }
                </div>
              </>
            )}
          </>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleAddEntity}
            className="p-2 bg-blue-500 text-white rounded"
            disabled={
              (entityType === 'mech' && (!chassis || (chassis !== 'custom' && !pattern))) ||
              (entityType === 'other' && (!category || !entity))
            }
          >
            Add Entity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEntityModal;