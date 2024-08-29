// src/App.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import ComponentLibrary from './components/ComponentLibrary';
import CircuitCanvas from './components/CircuitCanvas';
import ChatBot from './components/ChatBot';

function App() {
  const [components, setComponents] = useState([]);

  const handleAddComponent = (component) => {
    setComponents([...components, { ...component, x: 50, y: 50, id: Date.now() }]);
  };

  const handleRemoveComponent = (id) => {
    setComponents(components.filter(component => component.id !== id));
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, p: 2, borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <ComponentLibrary onAddComponent={handleAddComponent} />
      </Box>
      <Box sx={{ flex: 3, p: 2, overflow: 'auto', position: 'relative' }}>
        <CircuitCanvas components={components} setComponents={setComponents} onRemoveComponent={handleRemoveComponent} />
      </Box>
      <Box
        sx={{
          width: '300px',
          borderLeft: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          backgroundColor: '#f0f0f0',
          p: 2
        }}
      >
        <ChatBot />
      </Box>
    </Box>
  );
}

export default App;
