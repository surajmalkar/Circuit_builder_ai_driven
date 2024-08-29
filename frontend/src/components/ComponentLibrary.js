// src/components/ComponentLibrary.js
import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const ComponentLibrary = ({ onAddComponent }) => {
  const components = [
    { name: 'Resistor', type: 'resistor' },
    { name: 'Capacitor', type: 'capacitor' },
    { name: 'LED', type: 'led' },
    { name: 'Battery', type: 'battery' },
    { name: 'Transistor', type: 'transistor' },
    { name: 'Diode', type: 'diode' },
    { name: 'Switch', type: 'switch' },
    { name: 'Ground', type: 'ground' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Component Library</Typography>
      {components.map((component, index) => (
        <Button
          key={index}
          variant="contained"
          fullWidth
          sx={{ mb: 1, fontSize: '16px', fontWeight: 'bold' }}
          onClick={() => onAddComponent(component)}
        >
          {component.name}
        </Button>
      ))}
    </Box>
  );
};

export default ComponentLibrary;
