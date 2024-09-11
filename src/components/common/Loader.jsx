import React from 'react';
import Lottie from 'lottie-react';
import AnimationLoader from '../../assets/animations/Animation - Loader.json';

const Loader = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Lottie
        loop
        animationData={AnimationLoader}
        play
        className="w-32 h-32 sm:w-48 sm:h-48"
      />
    </div>
  );
};

export default Loader;
