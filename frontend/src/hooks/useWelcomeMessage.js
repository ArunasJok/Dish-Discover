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