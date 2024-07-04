import React from 'react';
import { Plus } from 'lucide-react';
import Entity from './components/Entity';
import AddEntityModal from './components/AddEntityModal';
import useEntityManagement from './hooks/useEntityManagement';

const App = () => {
  const {
    entities,
    showAddModal,
    setShowAddModal,
    addEntity,
    updateEntity,
    removeEntity,
    handleEntityActed,
    toggleEntityDisabled
  } = useEntityManagement();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Salvage Union Character Tracker</h1>
      <div className="flex flex-wrap -mx-1">
        {entities.map((entity) => (
          <Entity
            key={entity.id}
            entity={entity}
            onUpdate={updateEntity}
            onRemove={removeEntity}
            onActed={handleEntityActed}
            onToggleDisabled={toggleEntityDisabled}
          />
        ))}
      </div>
      <button onClick={() => setShowAddModal(true)} className="mt-4 p-2 bg-green-500 text-white rounded flex items-center text-sm">
        <Plus size={16} className="mr-1" /> Add Entity
      </button>
      
      {showAddModal && (
        <AddEntityModal
          onClose={() => setShowAddModal(false)}
          onAddEntity={addEntity}
        />
      )}
    </div>
  );
}

export default App;