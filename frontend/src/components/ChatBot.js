// src/components/ChatBot.js
import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    const botMessage = { text: getBotResponse(input), sender: 'bot' };

    setMessages([...messages, userMessage, botMessage]);
    setInput('');
  };

  const getBotResponse = (input) => {
    if (input.toLowerCase().includes('resistor')) {
      return 'A resistor is a passive two-terminal electrical component that implements electrical resistance as a circuit element.';
    }
    return "Sorry, I don't understand that question yet!";
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>AI Chat Assistant</Typography>
      <List sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={index} sx={{ textAlign: msg.sender === 'bot' ? 'left' : 'right' }}>
            <Typography variant="body1">
              <strong>{msg.sender === 'bot' ? 'Bot' : 'You'}: </strong>
              {msg.text}
            </Typography>
          </ListItem>
        ))}
      </List>
      <TextField
        variant="outlined"
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
};

export default ChatBot;
