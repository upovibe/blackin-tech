import React from 'react';

const Button = ({ children, className = '', iconLeft = null, iconRight = null, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-all duration-300 ${className}`}
      {...props}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default Button;
