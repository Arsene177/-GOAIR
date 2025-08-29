import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const onboardingSeen = localStorage.getItem('onboardingSeen');
    console.log('🔍 Onboarding useEffect - localStorage value:', onboardingSeen);
    
    if (!onboardingSeen) {
      console.log('🆕 New user - showing onboarding in 2 seconds');
      // Show onboarding after a short delay for new users
      const timer = setTimeout(() => {
        console.log('⏰ Timer fired - setting showOnboarding to true');
        setShowOnboarding(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    } else {
      console.log('👤 Returning user - setting hasSeenOnboarding to true');
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    // Mark onboarding as seen
    localStorage.setItem('onboardingSeen', 'true');
    setHasSeenOnboarding(true);
  };

  const showOnboardingAgain = () => {
    setShowOnboarding(true);
  };

  // Reset onboarding state - useful for testing or admin purposes
  const resetOnboarding = () => {
    localStorage.removeItem('onboardingSeen');
    setHasSeenOnboarding(false);
    setShowOnboarding(false);
    // Show onboarding again after a short delay
    setTimeout(() => {
      setShowOnboarding(true);
    }, 1000);
  };

  // Debug function to check current state
  const debugOnboardingState = () => {
    const stored = localStorage.getItem('onboardingSeen');
    console.log('Onboarding Debug:', {
      stored,
      showOnboarding,
      hasSeenOnboarding,
      timestamp: new Date().toISOString()
    });
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    handleCloseOnboarding,
    showOnboardingAgain,
    resetOnboarding,
    debugOnboardingState
  };
};
