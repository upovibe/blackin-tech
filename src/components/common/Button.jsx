import React from 'react';

const Button = ({ children, className = '', iconLeft = null, iconRight = null, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center px-4 py-1 md:px-4 md:py-2 md:text-base bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 ${className}`}
      {...props}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default Button;
