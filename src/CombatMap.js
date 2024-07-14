// CombatMap.js
import React, { useRef, useEffect, useState } from 'react';

const CombatMap = ({ entities, updateEntityPosition }) => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      entities.forEach((entity) => {
        const x = entity.position?.x || 0;
        const y = entity.position?.y || 0;

        const colorMap = {
          'bg-white': '#FFFFFF',
          'bg-red-100': '#FEE2E2',
          'bg-blue-100': '#DBEAFE',
          'bg-green-100': '#D1FAE5',
          'bg-yellow-100': '#FEF3C7',
        };

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = colorMap[entity.groupColor] || '#000000';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(entity.name, x, y + 5);
      });
    };

    drawMap();
  }, [entities]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    entities.forEach((entity) => {
      const dx = x - entity.position.x;
      const dy = y - entity.position.y;
      if (dx * dx + dy * dy < 400) { // 20 * 20 = 400 (radius squared)
        setDragging(entity);
      }
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      updateEntityPosition(dragging.id, x, y);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ border: '1px solid black' }}
    />
  );
};

export default CombatMap;