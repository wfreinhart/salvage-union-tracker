import mechChassisData from '../data/chassisData.json';
import otherEntitiesData from '../data/otherEntities.json';

export const createEntity = (entityData) => {
  const { entityType, chassis, pattern, category, entity } = entityData;

  if (entityType === 'mech') {
    if (chassis === 'custom') {
      return createCustomMech();
    } else {
      return createMech(chassis, pattern);
    }
  } else {
    return createOtherEntity(category, entity);
  }
};

const createCustomMech = () => ({
  id: Date.now(),
  name: "New Custom Mech",
  sp: 10, maxSp: 10,
  ep: 5, maxEp: 5,
  heat: 0, maxHeat: 5,
  pilots: [],
  hasActed: false,
  isDisabled: false,
  type: 'mech'
});

const createMech = (chassis, pattern) => {
  const chassisData = mechChassisData.mech_chassis.find(mech => mech.name === chassis);
  const patternData = chassisData.patterns.find(p => p.name === pattern);
  return {
    id: Date.now(),
    name: `${chassis} - ${pattern}`,
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
    type: 'mech'
  };
};

const createOtherEntity = (category, entityName) => {
  const categoryData = otherEntitiesData.other_entities.find(cat => cat.category === category);
  const entityData = categoryData.entities.find(ent => ent.name === entityName);
  return {
    id: Date.now(),
    ...entityData,
    category,
    sp: entityData.structure_pts,
    maxSp: entityData.structure_pts,
    hp: entityData.hp,
    maxHp: entityData.hp,
    hasActed: false,
    isDisabled: false,
    type: 'other'
  };
};

export const resetSelections = () => {
  // Reset any global selections if needed
};