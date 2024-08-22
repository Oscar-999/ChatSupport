"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import GitHubIcon from "@mui/icons-material/GitHub";
import styles from "./page.module.css";
import LoadingScreen from "./LoadingScreen";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  id?: number;
}

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  const [isLoading, setIsLoading] = useState(true); // Internal loading state for the timer
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer to manage the loading screen duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, []);

  // Populate initial assistant message only on client side
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello there! I am Jarvis. Feel free to ask me anything about superheroes!",
        timestamp: dayjs().format("HH:mm:ss"),
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const timestamp = dayjs().format("HH:mm:ss");
      const localMessage: Message = {
        role: "user",
        content: message,
        timestamp,
      };
      const apiMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, localMessage]);
      setMessage("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              apiMessage,
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let updatedMessage = "";
        const messageId = Date.now();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: updatedMessage,
            id: messageId,
            timestamp: dayjs().format("HH:mm:ss"),
          },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            updatedMessage += decoder.decode(value, { stream: true });

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId ? { ...msg, content: updatedMessage } : msg
              )
            );
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, content: updatedMessage } : msg
            )
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show the loading screen if the session is loading or the timer is still active
  if (status === "loading" || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box className={styles.background}></Box>
      <Box className={styles["dot-overlay"]}></Box>

      <Box
        width="100%"
        bgcolor="ED1D24"
        color="#FFFFFF"
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        fontSize="24px"
        fontWeight="bold"
        sx={{ zIndex: 3 }}
      >
        <Typography variant="h6" component="div">
          Welcome to Hero Chat
        </Typography>

        <IconButton
          aria-label="GitHub"
          href="https://github.com/Oscar-999/ChatSupport"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "#FFFFFF",
            "&:hover": {
              color: "#ED1D24",
            },
          }}
        >
          <GitHubIcon />
        </IconButton>

        <Button
          variant="contained"
          onClick={() => signOut()}
          sx={{
            bgcolor: "#ED1D24",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#9c1a1c",
            },
          }}
        >
          Logout
        </Button>
      </Box>

      <Box className={styles.onomatopoeia} sx={{ top: "20%", left: "10%" }}>
        BAM!
      </Box>
      <Box className={styles.onomatopoeia} sx={{ top: "50%", left: "80%" }}>
        POW!
      </Box>
      <Box className={styles.onomatopoeia} sx={{ top: "77%", left: "80%" }}>
        ZAP!
      </Box>
      <Box className={styles.onomatopoeia} sx={{ top: "20%", left: "80%" }}>
        WHAM!
      </Box>
      <Box className={styles.onomatopoeia} sx={{ top: "75%", left: "10%" }}>
        BOOM!
      </Box>
      <Box className={styles.onomatopoeia} sx={{ top: "50%", left: "10%" }}>
        BANG!
      </Box>

      <Box className={styles["message-box"]}>
        <Stack
          direction={"column"}
          width="100%"
          height="100%"
          border="3px solid #000000"
          boxShadow="0px 8px 12px rgba(1, 0, 0, 0.1)"
          borderRadius="12px"
          p={2}
          spacing={3}
          bgcolor="#FFFFFF"
        >
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            p={1}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  msg.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={msg.role === "assistant" ? "#fc2003" : "#55896a"}
                  color={msg.role === "assistant" ? "#FFFFFF" : "#FFFFFF"}
                  borderRadius="12px"
                  p={2}
                  boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
                  maxWidth="80%"
                  sx={{
                    animation: "popOutAnimation 0.5s ease-in-out",
                  }}
                >
                  {msg.content}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "right", marginTop: "8px" }}
                  >
                    {msg.timestamp}
                  </Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  "&:hover fieldset": {
                    borderColor: "#000000",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#333",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{
                bgcolor: "blue",
                color: "white",
                borderColor: "#000000",
                fontFamily: "'Roboto', sans-serif",
                "&:hover": {
                  bgcolor: "#ED1D24",
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

Home.requireAuth = true;
