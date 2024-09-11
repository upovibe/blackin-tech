import React from 'react';

const HorizontalLineWithText = ({ text = 'Or', className = '' }) => (
  <div className={`flex items-center justify-center w-full ${className}`}>
    <hr className="flex-1 border-t border-gray-400 mx-2" />
    <span className="px-2 text-gray-700">{text}</span>
    <hr className="flex-1 border-t border-gray-400 mx-2" />
  </div>
);

export default HorizontalLineWithText;
