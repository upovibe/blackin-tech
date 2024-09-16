import React, { useState } from 'react';

const Tooltip = ({ children, text, position = "top" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-1',
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = () => {
    setShowTooltip(!showTooltip); // Toggle on click
  };

  return (
    <div
      className="relative inline-block w-max"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick} // Toggle tooltip on click for mobile
    >
      {children}
      {showTooltip && (
        <div className={`absolute min-w-full border-2 border-slate-300/50 bg-slate-700 shadow-slate-800/10 text-white shadow-lg text-sm px-2 py-1 rounded-xl cursor-pointer z-50 w-max ${positions[position]}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
