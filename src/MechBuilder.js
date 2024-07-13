import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './components/ui/card.tsx';
import { EditableText, StatCounter } from './components/CommonComponents';
import { ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import mechChassisData from './data/chassisData.json';
import systemsData from './data/systems.json';
import modulesData from './data/modules.json';
import Tooltip from './components/Tooltip';

const EntityComponent = ({ item, type, isAttached, onAdd, onRemove }) => {
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
        <Card className="mb-1">
            <CardContent className="p-2 text-sm flex justify-between items-center">
                <Tooltip content={renderTooltipContent()}>
                    <span className="flex-grow">{item.name || item}</span>
                </Tooltip>
                {isAttached ? (
                    <button
                        onClick={() => onRemove(item)}
                        className="p-1 bg-red-500 text-white rounded-full"
                    >
                        <Minus size={14} />
                    </button>
                ) : (
                    <button
                        onClick={() => onAdd(item)}
                        className="p-1 bg-green-500 text-white rounded-full"
                    >
                        <Plus size={14} />
                    </button>
                )}
            </CardContent>
        </Card>
    );
};

const AccordionSection = ({ title, children, isOpen, toggleOpen }) => {
    return (
        <div className="border rounded-md mb-2">
            <button
                className="w-full p-2 text-left font-bold flex justify-between items-center"
                onClick={toggleOpen}
            >
                {title}
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && <div className="p-2">{children}</div>}
        </div>
    );
};

const MechBuilder = ({ saveCustomMechPattern, customMechPatterns, deleteCustomMechPattern }) => {
    const [showPatternMenu, setShowPatternMenu] = useState(false);
    const [selectedChassis, setSelectedChassis] = useState(null);
    const [showChassisSelection, setShowChassisSelection] = useState(false);
    const [customMech, setCustomMech] = useState({
        name: 'Custom Mech',
        systems: [],
        modules: [],
        usedSystemSlots: 0,
        usedModuleSlots: 0,
        scrapByTL: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        },
        sp: 0,
        maxSp: 0,
        ep: 0,
        maxEp: 0,
        heat: 0,
        maxHeat: 0,
        systemSlots: 0,
        moduleSlots: 0,
    });
    const [openAccordions, setOpenAccordions] = useState({
        systems: {},
        modules: {},
    });

    useEffect(() => {
        if (selectedChassis) {
            setCustomMech(prevMech => {
                // If systems and modules are already loaded, don't reset them
                if (prevMech.systems.length > 0 || prevMech.modules.length > 0) {
                    return {
                        ...prevMech,
                        sp: selectedChassis.stats.structure_pts,
                        maxSp: selectedChassis.stats.structure_pts,
                        ep: selectedChassis.stats.energy_pts,
                        maxEp: selectedChassis.stats.energy_pts,
                        heat: 0,
                        maxHeat: selectedChassis.stats.heat_cap,
                        systemSlots: selectedChassis.stats.system_slots,
                        moduleSlots: selectedChassis.stats.module_slots,
                    };
                }
                // Otherwise, reset everything
                return {
                    ...prevMech,
                    sp: selectedChassis.stats.structure_pts,
                    maxSp: selectedChassis.stats.structure_pts,
                    ep: selectedChassis.stats.energy_pts,
                    maxEp: selectedChassis.stats.energy_pts,
                    heat: 0,
                    maxHeat: selectedChassis.stats.heat_cap,
                    systemSlots: selectedChassis.stats.system_slots,
                    moduleSlots: selectedChassis.stats.module_slots,
                    scrapByTL: {
                        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
                        [selectedChassis.stats.tech_level]: selectedChassis.stats.salvage_value,
                    },
                    usedSystemSlots: 0,
                    usedModuleSlots: 0,
                    systems: [],
                    modules: [],
                };
            });
        }
    }, [selectedChassis]);

    const addComponent = (component, type) => {
        setCustomMech(prevMech => {
            const updatedScrapByTL = { ...prevMech.scrapByTL };
            updatedScrapByTL[component.techLevel] = (updatedScrapByTL[component.techLevel] || 0) + component.salvageValue;

            const slotType = type === 'systems' ? 'System' : 'Module';
            const usedSlots = prevMech[`used${slotType}Slots`] + component.slotsRequired;
            const maxSlots = prevMech[`${type.slice(0, -1)}Slots`];

            if (usedSlots > maxSlots) {
                alert(`Not enough ${slotType} slots available.`);
                return prevMech;
            }

            return {
                ...prevMech,
                [type]: [...prevMech[type], component],
                [`used${slotType}Slots`]: usedSlots,
                scrapByTL: updatedScrapByTL,
            };
        });
    };

    const removeComponent = (index, type) => {
        setCustomMech(prevMech => {
            const removedComponent = prevMech[type][index];
            const updatedScrapByTL = { ...prevMech.scrapByTL };
            updatedScrapByTL[removedComponent.techLevel] -= removedComponent.salvageValue;

            const slotType = type === 'systems' ? 'System' : 'Module';

            return {
                ...prevMech,
                [type]: prevMech[type].filter((_, i) => i !== index),
                [`used${slotType}Slots`]: prevMech[`used${slotType}Slots`] - removedComponent.slotsRequired,
                scrapByTL: updatedScrapByTL,
            };
        });
    };

    const addSystem = (system) => addComponent(system, 'systems');
    const addModule = (module) => addComponent(module, 'modules');
    const removeSystem = (index) => removeComponent(index, 'systems');
    const removeModule = (index) => removeComponent(index, 'modules');

    const toggleAccordion = (type, tl) => {
        setOpenAccordions(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [tl]: !prev[type][tl]
            }
        }));
    };

    const renderComponentsByTL = (components, type) => {
        const groupedComponents = components.reduce((acc, component) => {
            const tl = component.techLevel;
            if (!acc[tl]) acc[tl] = [];
            acc[tl].push(component);
            return acc;
        }, {});

        return Object.entries(groupedComponents).sort(([a], [b]) => a - b).map(([tl, components]) => (
            <AccordionSection
                key={`${type}-${tl}`}
                title={`TL ${tl}`}
                isOpen={openAccordions[type][tl]}
                toggleOpen={() => toggleAccordion(type, tl)}
            >
                <div className="space-y-2">
                    {components.map((component) => (
                        <EntityComponent
                            key={component.name}
                            item={{ name: component.name, ...component }}
                            type={type.slice(0, -1)} // 'systems' -> 'system', 'modules' -> 'module'
                            isAttached={false}
                            onAdd={() => type === 'systems' ? addSystem({ name: component.name, ...component }) : addModule({ name: component.name, ...component })}
                        />
                    ))}
                </div>
            </AccordionSection>
        ));
    };

    const handleSaveCustomMech = () => {
        if (!selectedChassis) {
            alert("Please select a chassis first.");
            return;
        }

        const customMechPattern = {
            name: customMech.name,
            chassis: selectedChassis.name,
            systems: customMech.systems.map(system => system.name),
            modules: customMech.modules.map(module => module.name),
            sp: customMech.sp,
            maxSp: customMech.maxSp,
            ep: customMech.ep,
            maxEp: customMech.maxEp,
            heat: customMech.heat,
            maxHeat: customMech.maxHeat,
            systemSlots: customMech.systemSlots,
            moduleSlots: customMech.moduleSlots,
        };

        saveCustomMechPattern(customMechPattern);
        alert("Custom mech pattern saved!");
    };

    const handleClearMech = () => {
        if (window.confirm("Are you sure you want to clear the current mech? This action cannot be undone.")) {
            setCustomMech({
                name: 'Custom Mech',
                systems: [],
                modules: [],
                usedSystemSlots: 0,
                usedModuleSlots: 0,
                scrapByTL: {
                    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
                },
                sp: 0,
                maxSp: 0,
                ep: 0,
                maxEp: 0,
                heat: 0,
                maxHeat: 0,
                systemSlots: 0,
                moduleSlots: 0,
            });
            setSelectedChassis(null);
        }
    };

    const loadCustomPattern = (pattern) => {
        const chassis = mechChassisData.mech_chassis.find(c => c.name === pattern.chassis);
        if (!chassis) {
            alert("Chassis not found for this pattern.");
            return;
        }

        const loadedSystems = pattern.systems.map(systemName => {
            const system = systemsData.systems[systemName];
            return { name: systemName, ...system };
        });

        const loadedModules = pattern.modules.map(moduleName => {
            const module = modulesData.modules[moduleName];
            return { name: moduleName, ...module };
        });

        const newCustomMech = {
            ...pattern,
            systems: loadedSystems,
            modules: loadedModules,
            scrapByTL: calculateScrapByTL(chassis, loadedSystems, loadedModules),
            usedSystemSlots: loadedSystems.reduce((total, system) => total + system.slotsRequired, 0),
            usedModuleSlots: loadedModules.reduce((total, module) => total + module.slotsRequired, 0),
        };

        setSelectedChassis(chassis);
        setCustomMech(newCustomMech);
        setShowPatternMenu(false);
    };

    const calculateScrapByTL = (chassis, systems, modules) => {
        const scrapByTL = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
            [chassis.stats.tech_level]: chassis.stats.salvage_value
        };

        systems.forEach(system => {
            scrapByTL[system.techLevel] += system.salvageValue;
        });

        modules.forEach(module => {
            scrapByTL[module.techLevel] += module.salvageValue;
        });

        return scrapByTL;
    };

    const handleDeletePattern = () => {
        if (window.confirm("Are you sure you want to delete this custom pattern?")) {
            deleteCustomMechPattern(customMech.name);
            setCustomMech({
                name: 'Custom Mech',
                systems: [],
                modules: [],
                usedSystemSlots: 0,
                usedModuleSlots: 0,
                scrapByTL: {
                    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
                },
                sp: 0,
                maxSp: 0,
                ep: 0,
                maxEp: 0,
                heat: 0,
                maxHeat: 0,
                systemSlots: 0,
                moduleSlots: 0,
            });
            setSelectedChassis(null);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Mech Builder</h2>

            <div className="mb-4 flex space-x-2">
                <button
                    onClick={() => setShowChassisSelection(!showChassisSelection)}
                    className="p-2 bg-blue-500 text-white rounded flex items-center"
                >
                    {selectedChassis ? selectedChassis.name : "Select Chassis"}
                    {showChassisSelection ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                </button>

                <button
                    onClick={() => setShowPatternMenu(!showPatternMenu)}
                    className="p-2 bg-green-500 text-white rounded flex items-center"
                >
                    Load Custom Pattern
                    {showPatternMenu ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                </button>
            </div>

            {showChassisSelection && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                    {mechChassisData.mech_chassis.map((chassis) => (
                        <button
                            key={chassis.name}
                            onClick={() => {
                                setSelectedChassis(chassis);
                                setShowChassisSelection(false);
                            }}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                            {chassis.name}
                        </button>
                    ))}
                </div>
            )}
            {showPatternMenu && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                    {customMechPatterns.map((pattern) => (
                        <button
                            key={pattern.name}
                            onClick={() => loadCustomPattern(pattern)}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                            {pattern.name}
                        </button>
                    ))}
                </div>
            )}

            {selectedChassis && (
                <Card className="mb-4">
                    <CardHeader>
                        <EditableText
                            value={customMech.name}
                            onChange={(newName) => setCustomMech(prevMech => ({ ...prevMech, name: newName }))}
                        />
                        <div className="flex space-x-2 mt-2">
                            <button
                                onClick={handleSaveCustomMech}
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Save Custom Mech Pattern
                            </button>
                            <button
                                onClick={handleDeletePattern}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete Custom Pattern
                            </button>
                            <button
                                onClick={handleClearMech}
                                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Clear Mech
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <StatCounter label="SP" value={customMech.sp} max={customMech.maxSp} />
                        <StatCounter label="EP" value={customMech.ep} max={customMech.maxEp} />
                        <StatCounter label="Heat" value={customMech.heat} max={customMech.maxHeat} />
                        <p>System Slots: {customMech.usedSystemSlots}/{customMech.systemSlots}</p>
                        <p>Module Slots: {customMech.usedModuleSlots}/{customMech.moduleSlots}</p>
                        <p>Scrap by Tech Level:</p>
                        {Object.entries(customMech.scrapByTL).map(([tl, value]) => (
                            <p key={tl}>TL {tl}: {value}</p>
                        ))}
                        <h3 className="font-bold mt-4 mb-2">Installed Systems:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {customMech.systems.map((system, index) => (
                                <EntityComponent
                                    key={index}
                                    item={system}
                                    type="system"
                                    isAttached={true}
                                    onRemove={() => removeSystem(index)}
                                />
                            ))}
                        </div>

                        <h3 className="font-bold mt-4 mb-2">Installed Modules:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {customMech.modules.map((module, index) => (
                                <EntityComponent
                                    key={index}
                                    item={module}
                                    type="module"
                                    isAttached={true}
                                    onRemove={() => removeModule(index)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold mb-2">Available Systems:</h3>
                    {renderComponentsByTL(Object.entries(systemsData.systems).map(([name, system]) => ({ name, ...system })), 'systems')}
                </div>
                <div>
                    <h3 className="font-bold mb-2">Available Modules:</h3>
                    {renderComponentsByTL(Object.entries(modulesData.modules).map(([name, module]) => ({ name, ...module })), 'modules')}
                </div>
            </div>
        </div>
    );
};

export default MechBuilder;