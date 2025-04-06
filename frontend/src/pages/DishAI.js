import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { sendChatMessage } from '../services/aiService';

const DishAI = () => {
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentIngredients] = useState(() => {
        return sessionStorage.getItem('lastIngredients') || '';
    });
    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        // Initial greeting
        setConversation([{
            role: 'assistant',
            content: `Hello! I'm your cooking assistant. ${recentIngredients ? 
                `I see you have ${recentIngredients}. Would you like recipe suggestions using these ingredients?` : 
                'What would you like to cook today?'}`
        }]);
    }, [recentIngredients]);

    const handleSendMessage = async () => {
      if (!userInput.trim()) return;
      setLoading(true);
  
      try {
          const data = await sendChatMessage(
              userInput,
              recentIngredients,
              conversation,
              authToken
          );
  
          setConversation(prev => [...prev, 
              { role: 'user', content: userInput },
              { role: 'assistant', content: data.response }
          ]);
      } catch (error) {
          console.error('Chat request failed:', error);
          setConversation(prev => [...prev, 
              { role: 'user', content: userInput },
              { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
          ]);
      } finally {
          setLoading(false);
          setUserInput('');
      }
  };

    return (
        <Container maxWidth="md" sx={{ mt: 12 }}>
            <Typography variant="h4" gutterBottom>
                Dish AI Assistant
            </Typography>
            
            <Paper elevation={3} sx={{ 
                height: '60vh', 
                p: 2, 
                mb: 2, 
                overflowY: 'auto',
                bgcolor: 'grey.50'
            }}>
                {conversation.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: message.role === 'user' ? 'primary.light' : 'white',
                            color: message.role === 'user' ? 'white' : 'text.primary',
                            borderRadius: 2,
                            maxWidth: '80%',
                            ml: message.role === 'user' ? 'auto' : 0,
                            boxShadow: 1
                        }}
                    >
                        <Typography>{message.content}</Typography>
                    </Box>
                ))}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about recipes or meal planning..."
                    variant="outlined"
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={loading}
                    sx={{ minWidth: '100px' }}
                >
                    Send
                </Button>
            </Box>
        </Container>
    );
};

export default DishAI;