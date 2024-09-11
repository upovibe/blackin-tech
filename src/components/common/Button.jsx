import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
