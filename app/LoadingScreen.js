import React, { useEffect, useState } from 'react';
import './LoadingScreen.css'; // Ensure to create a corresponding CSS file

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Duration of the loading screen

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div id="loading-screen">
      <div id="loading-logo">
        <h1>Hero Chat</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
