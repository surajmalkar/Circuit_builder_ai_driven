// src/components/CircuitCanvas.js
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const handleSize = 10; // Size of the drag handle

const CircuitCanvas = ({ components, setComponents, onRemoveComponent }) => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [draggingHandle, setDraggingHandle] = useState(null);
  const [connections, setConnections] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [connectionMode, setConnectionMode] = useState(false);
  const [startComponent, setStartComponent] = useState(null);
  const [rotatingHandle, setRotatingHandle] = useState(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw components
    components.forEach(component => {
      ctx.fillStyle = 'black';
      ctx.fillRect(component.x, component.y, 50, 20);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(component.type, component.x + 5, component.y + 15);
    });

    // Draw connections
    connections.forEach(({ start, end, rotation }) => {
      ctx.save();
      ctx.translate(start.x + 25, start.y + 10);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(end.x - start.x, end.y - start.y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Draw handles
      ctx.beginPath();
      ctx.arc(start.x + 25, start.y + 10, handleSize / 2, 0, 2 * Math.PI);
      ctx.arc(end.x + 25, end.y + 10, handleSize / 2, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });
  }, [components, connections]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if a handle was clicked
    const connection = connections.find(({ start, end }) =>
      (Math.hypot(start.x + 25 - x, start.y + 10 - y) < handleSize / 2) ||
      (Math.hypot(end.x + 25 - x, end.y + 10 - y) < handleSize / 2)
    );

    if (connection) {
      setDraggingHandle(connection);
      setDragging(null);
      return;
    }

    // Check if a rotating handle was clicked
    const rotatingHandle = connections.find(({ start, end }) =>
      (Math.hypot((start.x + end.x) / 2 - x, (start.y + end.y) / 2 - y) < handleSize / 2)
    );

    if (rotatingHandle) {
      setRotatingHandle(rotatingHandle);
      setDragging(null);
      return;
    }

    const component = components.find(c => x >= c.x && x <= c.x + 50 && y >= c.y && y <= c.y + 20);
    if (component) {
      setDragging({ ...component, offsetX: x - component.x, offsetY: y - component.y });
      setSelectedComponent(component);
    } else {
      setDragging(null);
      setSelectedComponent(null);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newComponents = components.map(c =>
        c.id === dragging.id ? { ...c, x: x - dragging.offsetX, y: y - dragging.offsetY } : c
      );
      setComponents(newComponents);

      // Update connections
      const newConnections = connections.map(({ start, end, rotation }) =>
        start.id === dragging.id ? { start: { ...dragging, x: x - dragging.offsetX, y: y - dragging.offsetY }, end, rotation } :
        end.id === dragging.id ? { start, end: { ...dragging, x: x - dragging.offsetX, y: y - dragging.offsetY }, rotation } :
        { start, end, rotation }
      );
      setConnections(newConnections);
    } else if (draggingHandle) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { start, end } = draggingHandle;
      const updatedConnections = connections.map(({ start: s, end: e, rotation }) =>
        (s === start && e === end) ? { start: { ...s, x: x - handleSize / 2, y: y - handleSize / 2 }, end, rotation } :
        (s === end && e === start) ? { start, end: { ...e, x: x - handleSize / 2, y: y - handleSize / 2 }, rotation } :
        { start: s, end: e, rotation }
      );

      setConnections(updatedConnections);
    } else if (rotatingHandle) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { start, end } = rotatingHandle;
      const centerX = (start.x + end.x + 50) / 2;
      const centerY = (start.y + end.y + 20) / 2;

      const angle = Math.atan2(y - centerY, x - centerX);

      const updatedConnections = connections.map(({ start: s, end: e, rotation }) =>
        (s === start && e === end) ? { start: s, end: e, rotation: angle } :
        (s === end && e === start) ? { start: e, end: s, rotation: angle } :
        { start: s, end: e, rotation }
      );

      setConnections(updatedConnections);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setDraggingHandle(null);
    setRotatingHandle(null);
  };

  const handleRemoveComponent = () => {
    if (selectedComponent) {
      onRemoveComponent(selectedComponent.id);
      setSelectedComponent(null);

      // Remove connections related to the component
      setConnections(connections.filter(({ start, end }) =>
        start.id !== selectedComponent.id && end.id !== selectedComponent.id
      ));
    }
  };

  const handleAddConnection = (startComponent, endComponent) => {
    if (startComponent && endComponent && startComponent.id !== endComponent.id) {
      setConnections([...connections, { start: startComponent, end: endComponent, rotation: 0 }]);
    }
  };

  const toggleConnectionMode = () => {
    setConnectionMode(!connectionMode);
  };

  const handleCanvasClick = (e) => {
    if (connectionMode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const component = components.find(c => x >= c.x && x <= c.x + 50 && y >= c.y && y <= c.y + 20);

      if (startComponent && component && startComponent.id !== component.id) {
        handleAddConnection(startComponent, component);
        setStartComponent(null);
        setConnectionMode(false);
      } else {
        setStartComponent(component);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Circuit Canvas</Typography>
      <button onClick={toggleConnectionMode}>
        {connectionMode ? 'Cancel Connection' : 'Add Connection'}
      </button>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}
      />
      {selectedComponent && (
        <Box sx={{ position: 'absolute', bottom: 0, right: 0, p: 2 }}>
          <button onClick={handleRemoveComponent}>Remove Component</button>
        </Box>
      )}
    </Box>
  );
};

export default CircuitCanvas;
