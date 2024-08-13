'use client';
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello there! I am Jarvis feel free to ask me anything about superheros!!'
    }
  ]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = { role: 'user', content: message };
      setMessages([...messages, newMessage]);
      setMessage('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: [...messages, newMessage] }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let updatedMessage = '';
        const messageId = Date.now();

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: updatedMessage, id: messageId },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          updatedMessage += decoder.decode(value, { stream: true });

          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId ? { ...msg, content: updatedMessage } : msg
            )
          );
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, content: updatedMessage } : msg
          )
        );

      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >

      <Box  sx={{
    zIndex: 2,
    width: { xs: '90%', sm: '60%', md: '40%', lg: '30%' }, // Adjusts width based on screen size
    height: { xs: '67%', sm: '70%', md: '75%', lg: '77%' }, // Adjusts height based on screen size
    maxWidth: '120%', // Ensures width does not exceed 120%
    maxHeight: '75%', // Ensures height does not exceed 75%
    margin: '0 auto', // Centers the Box horizontally
  }}>
        <Stack
          direction={'column'}
          width="100%"
          height="100%"
          border="3px solid #000000"
          boxShadow="0px 8px 12px rgba(1, 0, 0, 0.1)"
          borderRadius="12px"
          p={2}
          spacing={3}
          bgcolor="#FFFFFF"
          zIndex={2}
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            p={1}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box
                  bgcolor={msg.role === 'assistant' ? '#fc2003' : '#55896a'}
                  color={msg.role === 'assistant' ? 'FFFFFF' : '#FFFFF'}
                  borderRadius="12px"
                  p={2}
                  boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
                  maxWidth="80%"
                >
                  {msg.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: '100%',
              gap: 1,
            }}
          >
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  '&:hover fieldset': {
                    borderColor: '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#333',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{
                bgcolor: 'blue',
                color: 'white',
                borderColor: '#000000',
                fontFamily: "'Roboto', sans-serif",
                '&:hover': {
                  bgcolor: '#f06292',
                },
                '& fieldset': {
                  borderColor: '#000000',
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>

  );
}
