import React, { useRef, useEffect, useState, useCallback } from 'react';

const CombatMap = ({ entities, updateEntityPosition }) => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [panning, setPanning] = useState(false);
  const [viewportTransform, setViewportTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [lastPanPoint, setLastPanPoint] = useState(null);
  const [mapImage, setMapImage] = useState(null);
  const [mapScale, setMapScale] = useState(1);

  const createHexPattern = (ctx) => {
    const patternCanvas = document.createElement('canvas');
    const patternContext = patternCanvas.getContext('2d');
    patternCanvas.width = 56;
    patternCanvas.height = 100;
  
    patternContext.strokeStyle = '#a0a0a0';
    patternContext.lineWidth = 1.0;
    patternContext.beginPath();
    patternContext.moveTo(28, 66);
    patternContext.lineTo(0, 50);
    patternContext.lineTo(0, 16);
    patternContext.lineTo(28, 0);
    patternContext.lineTo(56, 16);
    patternContext.lineTo(56, 50);
    patternContext.lineTo(28, 66);
    patternContext.lineTo(28, 100);
    patternContext.stroke();
  
    return ctx.createPattern(patternCanvas, 'repeat');
  };

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Apply viewport transform
    ctx.translate(viewportTransform.x, viewportTransform.y);
    ctx.scale(viewportTransform.scale, viewportTransform.scale);
  
    // Draw imported map if available
    if (mapImage) {
      const scaledWidth = mapImage.width * mapScale;
      const scaledHeight = mapImage.height * mapScale;
      
      ctx.drawImage(mapImage, 0, 0, scaledWidth, scaledHeight);
    }
  
    // Create and draw the hex grid pattern
    const hexPattern = createHexPattern(ctx);
    ctx.fillStyle = hexPattern;
    ctx.globalAlpha = 0.3; // Adjust this value to change the grid opacity
    ctx.fillRect(0, 0, canvas.width / viewportTransform.scale, canvas.height / viewportTransform.scale);
    ctx.globalAlpha = 1; // Reset the global alpha
  
    // Draw entities
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
      ctx.lineWidth = 2 / viewportTransform.scale;
      ctx.stroke();
  
      ctx.fillStyle = '#000000';
      ctx.font = `${12 / viewportTransform.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(entity.name, x, y + 5 / viewportTransform.scale);
    });
  
    ctx.restore();
  }, [entities, viewportTransform, mapImage, mapScale]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - viewportTransform.x) / viewportTransform.scale;
    const y = (e.clientY - rect.top - viewportTransform.y) / viewportTransform.scale;

    let entityFound = false;
    entities.forEach((entity) => {
      const dx = x - entity.position.x;
      const dy = y - entity.position.y;
      if (dx * dx + dy * dy < 400 / (viewportTransform.scale * viewportTransform.scale)) {
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
      const x = (e.clientX - rect.left - viewportTransform.x) / viewportTransform.scale;
      const y = (e.clientY - rect.top - viewportTransform.y) / viewportTransform.scale;
  
      updateEntityPosition(dragging.id, x, y);
    } else if (panning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setViewportTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
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
    const newScale = viewportTransform.scale * zoomFactor;

    // Limit zoom level (optional)
    if (newScale < 0.1 || newScale > 10) return;

    const scaleChange = newScale - viewportTransform.scale;
    const newX = viewportTransform.x - ((mouseX - viewportTransform.x) / viewportTransform.scale) * scaleChange;
    const newY = viewportTransform.y - ((mouseY - viewportTransform.y) / viewportTransform.scale) * scaleChange;

    setViewportTransform({ x: newX, y: newY, scale: newScale });
  };

  const resetZoom = () => {
    setViewportTransform({ x: 0, y: 0, scale: 1 });
  };

  const handleMapUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setMapImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapScaleChange = (e) => {
    setMapScale(parseFloat(e.target.value));
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
      <div className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded flex items-center">
        <span className="mr-2">Zoom: {(viewportTransform.scale * 100).toFixed(0)}%</span>
        <button
          onClick={resetZoom}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
        >
          Reset Zoom
        </button>
        <input
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          onChange={handleMapUpload}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
        />
        <div className="flex items-center ml-2">
          <label htmlFor="mapScale" className="mr-2">Map Scale:</label>
          <input
            type="range"
            id="mapScale"
            min="0.1"
            max="2"
            step="0.1"
            value={mapScale}
            onChange={handleMapScaleChange}
            className="w-32"
          />
          <span className="ml-2">{mapScale.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
};

export default CombatMap;