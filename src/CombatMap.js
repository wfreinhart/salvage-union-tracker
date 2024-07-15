// CombatMap.js
import React, { useRef, useEffect, useState, useCallback } from 'react';

const CombatMap = ({ entities, updateEntityPosition }) => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [panning, setPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState(null);
  const [scale, setScale] = useState(1);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(scale, scale);

    // Draw background (optional)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(-panOffset.x / scale, -panOffset.y / scale, canvas.width / scale, canvas.height / scale);

    // Draw border
    ctx.strokeStyle = 'black';
    ctx.strokeRect(-panOffset.x / scale, -panOffset.y / scale, canvas.width / scale, canvas.height / scale);

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
      ctx.lineWidth = 2 / scale;
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = `${12 / scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(entity.name, x, y + 5 / scale);
    });

    ctx.restore();
  }, [entities, panOffset, scale]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / scale;
    const y = (e.clientY - rect.top - panOffset.y) / scale;

    let entityFound = false;
    entities.forEach((entity) => {
      const dx = x - entity.position.x;
      const dy = y - entity.position.y;
      if (dx * dx + dy * dy < 400) { // 20 * 20 = 400 (radius squared)
        setDragging(entity);
        entityFound = true;
      }
    });

    if (!entityFound) {
      setPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / scale;
      const y = (e.clientY - rect.top - panOffset.y) / scale;

      updateEntityPosition(dragging.id, x, y);
    } else if (panning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * zoomFactor;

    // Limit zoom level (optional)
    if (newScale < 0.1 || newScale > 10) return;

    const newPanOffsetX = mouseX - (mouseX - panOffset.x) * zoomFactor;
    const newPanOffsetY = mouseY - (mouseY - panOffset.y) * zoomFactor;

    setScale(newScale);
    setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
  };

  const resetZoom = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ border: '1px solid black' }}
      />
      <div className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded">
        <span className="mr-2">Zoom: {(scale * 100).toFixed(0)}%</span>
        <button
          onClick={resetZoom}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
};

export default CombatMap;