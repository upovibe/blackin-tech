import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import AnimationProgress from '../../assets/animations/Animation - Progress.json';
import { useLocation } from 'react-router-dom';

const ProgressBar = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Detect route changes

  useEffect(() => {
    // Start loading when navigating to a new page or refreshing
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Listen to route changes (navigation) to show/hide the progress bar
    handleStart();
    handleComplete();

    return () => {
      handleComplete();
    };
  }, [location]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-2 bg-transparent z-50">
      <Lottie
        loop
        animationData={AnimationProgress}
        play
        className="w-full h-full"
      />
    </div>
  );
};

export default ProgressBar;
