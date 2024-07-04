import { useState } from 'react';
import { createEntity, resetSelections } from '../utils/entityUtils';

const useEntityManagement = () => {
  const [entities, setEntities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addEntity = (entityData) => {
    const newEntity = createEntity(entityData);
    setEntities([...entities, newEntity]);
    setShowAddModal(false);
    resetSelections();
  };

  const updateEntity = (id, updatedEntity) => {
    setEntities(entities.map(entity => entity.id === id ? updatedEntity : entity));
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

  return {
    entities,
    showAddModal,
    setShowAddModal,
    addEntity,
    updateEntity,
    removeEntity,
    handleEntityActed,
    toggleEntityDisabled
  };
};

export default useEntityManagement;