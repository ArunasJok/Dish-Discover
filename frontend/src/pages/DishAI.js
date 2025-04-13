// This file is part of the Dish Discover application, which provides a cooking assistant feature using AI.
// The DishAI component allows users to interact with an AI assistant for recipe suggestions and meal planning.
import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Box, 
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    FormControlLabel,
    Checkbox 
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { sendChatMessage } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

const DishAI = () => {
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentIngredients] = useState(() => {
        return sessionStorage.getItem('lastIngredients') || '';
    });
    const [includeIngredients, setIncludeIngredients] = useState(false);
    const { authToken } = useContext(AuthContext);
    const chatEndRef = useRef(null);
    
    // Initialize conversation with a welcome message
    useEffect(() => {       
        setConversation([{
            role: 'assistant',
            content: `Hello! I'm your cooking assistant. What would you like to cook today?`
        }]);
                
        if (recentIngredients) {
            setConversation(prev => [...prev, {
                role: 'assistant',
                content: `I see you recently searched for recipes with: ${recentIngredients}. Would you like me to suggest recipes using these ingredients? You can toggle the option below.`
            }]);
        }
    }, [recentIngredients]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    // Function to handle sending messages
    const handleSendMessage = async () => {
      if (!userInput.trim()) return;
      setLoading(true);
  
      try {       
        const formattedMessage = userInput.includes("recipe") ? 
            `${userInput} (Please format your response with clear headings, bullet points for ingredients, and numbered steps for instructions. Use markdown formatting.)` :
            userInput;
            
        const data = await sendChatMessage(
            formattedMessage,
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
                        {message.role === 'user' ? (
                            <Typography>{message.content}</Typography>
                        ) : (
                            <ReactMarkdown
                                components={{
                                    h1: props => <Typography variant="h5" {...props} sx={{ mt: 2, mb: 1, fontWeight: 'bold' }} />,
                                    h2: props => <Typography variant="h6" {...props} sx={{ mt: 2, mb: 1, fontWeight: 'bold' }} />,
                                    h3: props => <Typography variant="subtitle1" {...props} sx={{ mt: 1.5, mb: 0.5, fontWeight: 'bold' }} />,
                                    p: props => <Typography variant="body1" {...props} sx={{ my: 1 }} />,
                                    ul: props => <List dense disablePadding {...props} sx={{ pl: 2 }} />,
                                    ol: props => <List dense {...props} sx={{ pl: 2 }} component="ol" />,
                                    li: props => (
                                        <ListItem sx={{ display: 'list-item', pl: 0, py: 0.25 }}>
                                            <ListItemText primary={props.children} />
                                        </ListItem>
                                    ),
                                    hr: () => <Divider sx={{ my: 1.5 }} />
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </Box>
                ))}
                <div ref={chatEndRef} />
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Paper>

            {recentIngredients && (
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={includeIngredients}
                                onChange={(e) => setIncludeIngredients(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={`Include my recent ingredients: ${recentIngredients}`}
                    />
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask about recipes or meal planning..."
                    variant="outlined"
                    disabled={loading}
                    multiline
                    maxRows={3}
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