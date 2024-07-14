// CombatTracker.js
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Entity from './Entity';
import mechChassisData from './data/chassisData.json';
import otherEntitiesData from './data/otherEntities.json';

const groupColors = [
    'bg-white',
    'bg-red-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
];

const CombatTracker = ({ customMechPatterns, entities, setEntities }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEntityType, setSelectedEntityType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedChassis, setSelectedChassis] = useState('');
    const [selectedPattern, setSelectedPattern] = useState('');
    const [selectedEntity, setSelectedEntity] = useState('');
    const [availablePatterns, setAvailablePatterns] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Sort entities after a delay
            const sortedEntities = [...entities].sort((a, b) => {
                const colorComparison = groupColors.indexOf(a.groupColor) - groupColors.indexOf(b.groupColor);
                if (colorComparison !== 0) return colorComparison;
                return a.name.localeCompare(b.name);
            });
            setEntities(sortedEntities);
        }, 1500); // 1500 ms delay

        return () => clearTimeout(timer); // Cleanup timer on unmount or entities change
    }, [entities, setEntities]);

    const changeEntityGroupColor = (id) => {
        setEntities(entities.map(entity => {
            if (entity.id === id) {
                const currentColorIndex = groupColors.indexOf(entity.groupColor || 'bg-white');
                const nextColorIndex = (currentColorIndex + 1) % groupColors.length;
                return { ...entity, groupColor: groupColors[nextColorIndex] };
            }
            return entity;
        }));
    };

    const addEntity = () => {
        let newEntity;
        if (selectedEntityType === 'mech') {
            if (selectedChassis === 'custom') {
                const customPattern = customMechPatterns.find(pattern => pattern.name === selectedPattern);
                newEntity = {
                    id: Date.now().toString(),
                    ...customPattern,
                    patternId: customPattern.id, // Store the pattern ID
                    pilots: [],
                    hasActed: false,
                    isDisabled: false,
                    type: 'mech',
                    groupColor: 'bg-white',
                    position: { x: Math.floor(Math.random() * 700) + 50, y: Math.floor(Math.random() * 500) + 50 },
                };
            } else {
                const chassisData = mechChassisData.mech_chassis.find(mech => mech.name === selectedChassis);
                const patternData = chassisData.patterns.find(pattern => pattern.name === selectedPattern);
                newEntity = {
                    id: Date.now().toString(),
                    name: `${selectedChassis} - ${selectedPattern}`,
                    sp: chassisData.stats.structure_pts,
                    maxSp: chassisData.stats.structure_pts,
                    ep: chassisData.stats.energy_pts,
                    maxEp: chassisData.stats.energy_pts,
                    heat: 0,
                    maxHeat: chassisData.stats.heat_cap,
                    pilots: [],
                    systems: patternData.systems,
                    modules: patternData.modules,
                    hasActed: false,
                    isDisabled: false,
                    type: 'mech',
                    groupColor: 'bg-white',
                    position: { x: Math.floor(Math.random() * 700) + 50, y: Math.floor(Math.random() * 500) + 50 },
                };
            }
        } else {
            const categoryData = otherEntitiesData.other_entities.find(cat => cat.category === selectedEntityType);
            const entityData = categoryData.entities.find(ent => ent.name === selectedEntity);
            newEntity = {
                id: Date.now().toString(),
                ...entityData,
                category: selectedEntityType,
                sp: entityData.structure_pts,
                maxSp: entityData.structure_pts,
                hp: entityData.hp,
                maxHp: entityData.hp,
                hasActed: false,
                isDisabled: false,
                type: 'other',
                groupColor: 'bg-white',
                position: { x: Math.floor(Math.random() * 700) + 50, y: Math.floor(Math.random() * 500) + 50 },
            };
        }
        setEntities([...entities, newEntity]);
        setShowAddModal(false);
        resetSelections();
    };

    const duplicateEntity = (entityToDuplicate) => {
        const baseName = entityToDuplicate.name.replace(/\s*\(\d+\)$/, '');
        const existingCopies = entities.filter(e => e.name.startsWith(baseName));
        let newNumber = existingCopies.length + 1;

        // Find the next available number
        const usedNumbers = new Set(
            existingCopies
                .map(e => {
                    const match = e.name.match(/\((\d+)\)$/);
                    return match ? parseInt(match[1], 10) : 0;
                })
                .filter(n => n > 0)
        );

        while (usedNumbers.has(newNumber)) {
            newNumber++;
        }

        const newEntity = {
            ...entityToDuplicate,
            id: Date.now().toString(), // Ensure a new unique ID
            name: `${baseName} (${newNumber})`,
            position: {
                x: Math.floor(Math.random() * 700) + 50, // Random x between 50 and 750
                y: Math.floor(Math.random() * 500) + 50  // Random y between 50 and 550
            }
        };
        setEntities([...entities, newEntity]);
    };

    const resetSelections = () => {
        setSelectedEntityType('');
        setSelectedChassis('');
        setSelectedPattern('');
        setSelectedEntity('');
    };

    const selectChassis = (chassisName) => {
        setSelectedChassis(chassisName);
        if (chassisName === 'custom') {
            setAvailablePatterns([]);
        } else {
            const chassis = mechChassisData.mech_chassis.find(mech => mech.name === chassisName);
            setAvailablePatterns(chassis ? chassis.patterns.map(p => p.name) : []);
        }
        setSelectedPattern('');
    };

    const selectPattern = (patternName) => {
        setSelectedPattern(patternName);
    };

    const updateEntity = (id, updatedProperties) => {
        setEntities(entities.map(entity =>
            entity.id === id ? { ...entity, ...updatedProperties } : entity
        ));
    };

    const updateEntityComponent = (entityId, componentType, componentIndex, updatedProperties) => {
        setEntities(entities.map(entity => {
            if (entity.id === entityId) {
                const updatedComponents = entity[componentType].map((component, index) =>
                    index === componentIndex ? { ...component, ...updatedProperties } : component
                );
                return { ...entity, [componentType]: updatedComponents };
            }
            return entity;
        }));
    };

    const removeEntity = (id) => {
        setEntities(entities.filter(entity => entity.id !== id));
    };

    const handleEntityActed = (id) => {
        let updatedEntities = entities.map(entity =>
            entity.id === id ? { ...entity, hasActed: !entity.hasActed } : entity
        );

        const allActed = updatedEntities.every(entity => entity.hasActed);
        if (allActed) {
            updatedEntities = updatedEntities.map(entity => ({ ...entity, hasActed: false }));
        }

        setEntities(updatedEntities);
    };

    const toggleEntityDisabled = (id) => {
        setEntities(entities.map(entity =>
            entity.id === id ? { ...entity, isDisabled: !entity.isDisabled } : entity
        ));
    };

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100px' }}>
                {entities.map((entity, index) => (
                    <div
                        key={entity.id}
                        style={{
                            width: 'calc(25% - 1rem)',
                            margin: '0.5rem',
                        }}
                    >
                        <Entity
                            entity={entity}
                            onUpdate={(updatedProperties) => updateEntity(entity.id, updatedProperties)}
                            onUpdateComponent={(componentType, componentIndex, updatedProperties) =>
                                updateEntityComponent(entity.id, componentType, componentIndex, updatedProperties)}
                            onRemove={() => removeEntity(entity.id)}
                            onActed={() => handleEntityActed(entity.id)}
                            onToggleDisabled={() => toggleEntityDisabled(entity.id)}
                            onChangeGroupColor={() => changeEntityGroupColor(entity.id)}
                            onDuplicate={duplicateEntity}
                        />
                    </div>
                ))}
            </div>

            <button onClick={() => setShowAddModal(true)} className="mt-4 p-2 bg-green-500 text-white rounded flex items-center text-sm">
                <Plus size={16} className="mr-1" /> Add Entity
            </button>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                        <h2 className="text-lg font-bold mb-2">Add New Entity</h2>
                        <div className="mb-4 grid grid-cols-3 gap-2">
                            <button
                                onClick={() => {
                                    setSelectedEntityType('Mechs');
                                    setSelectedCategory('');
                                }}
                                className={`p-2 ${selectedEntityType === 'Mechs' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                            >
                                Mechs
                            </button>
                            {otherEntitiesData.other_entities.map((category) => (
                                <button
                                    key={category.category}
                                    onClick={() => {
                                        setSelectedEntityType(category.category);
                                        setSelectedCategory(category.category);
                                        setSelectedChassis('');
                                        setSelectedPattern('');
                                        setSelectedEntity('');
                                    }}
                                    className={`p-2 ${selectedEntityType === category.category ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                                >
                                    {category.category}
                                </button>
                            ))}
                        </div>

                        {selectedEntityType === 'Mechs' && (
                            <>
                                <h3 className="font-bold mb-2">Select Chassis:</h3>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {mechChassisData.mech_chassis.map((chassis) => (
                                        <button
                                            key={chassis.name}
                                            onClick={() => selectChassis(chassis.name)}
                                            className={`p-2 ${selectedChassis === chassis.name ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                                        >
                                            {chassis.name}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => selectChassis('custom')}
                                        className={`p-2 ${selectedChassis === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                                    >
                                        Custom Mech
                                    </button>
                                </div>

                                {selectedChassis && selectedChassis !== 'custom' && (
                                    <>
                                        <h3 className="font-bold mb-2">Select Pattern:</h3>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {availablePatterns.map((pattern) => (
                                                <button
                                                    key={pattern}
                                                    onClick={() => selectPattern(pattern)}
                                                    className={`p-2 ${selectedPattern === pattern ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                                                >
                                                    {pattern}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedChassis === 'custom' && (
                                    <>
                                        <h3 className="font-bold mb-2">Select Custom Mech Pattern:</h3>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {customMechPatterns.map((pattern) => (
                                                <button
                                                    key={pattern.name}
                                                    onClick={() => selectPattern(pattern.name)}
                                                    className={`p-2 ${selectedPattern === pattern.name ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                                                >
                                                    {pattern.name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        {selectedCategory && selectedCategory !== 'Mechs' && (
                            <>
                                <h3 className="font-bold mb-2">Select Entity:</h3>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {otherEntitiesData.other_entities
                                        .find(cat => cat.category === selectedCategory)
                                        ?.entities.map((entity) => (
                                            <button
                                                key={entity.name}
                                                onClick={() => setSelectedEntity(entity.name)}
                                                className={`p-2 ${selectedEntity === entity.name ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                                            >
                                                {entity.name}
                                            </button>
                                        ))
                                    }
                                </div>
                            </>
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="mr-2 p-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addEntity}
                                className="p-2 bg-blue-500 text-white rounded"
                                disabled={
                                    (selectedEntityType === 'Mechs' && (!selectedChassis || (selectedChassis !== 'custom' && !selectedPattern))) ||
                                    (selectedEntityType !== 'Mechs' && !selectedEntity)
                                }
                            >
                                Add Entity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CombatTracker;