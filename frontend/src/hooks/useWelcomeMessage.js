// This hook manages the display of a welcome message in the application.
// It checks if the user has seen the message before and sets a timer to hide it after 20 seconds.
import { useState, useEffect } from 'react';

export const useWelcomeMessage = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    } else {
      sessionStorage.setItem('hasSeenWelcome', 'true');
      const timer = setTimeout(() => setShowWelcome(false), 20000);
      return () => clearTimeout(timer);
    }
  }, []);

  return {
    showWelcome
  };
};