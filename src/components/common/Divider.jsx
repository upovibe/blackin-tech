import React from 'react';

const Divider = ({ direction = 'horizontal', className = '' }) => {
  const isHorizontal = direction === 'horizontal';
  
  return (
    <div
      className={`${className} ${isHorizontal ? 'w-full h-0.5' : 'h-full w-0.5'} bg-gray-400`}
    />
  );
};

export default Divider;
