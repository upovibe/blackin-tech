import React from 'react';

const Input = ({ placeholder, type = 'text', className = '', ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full py-1.5 px-3 bg-slate-200 text-slate-900 rounded-md placeholder-slate-500 border-2 border-slate-300/15 focus:border-transparent focus:border-slate-500 focus:ring-2 focus:ring-slate-300 outline-none transition-all duration-300 ${className}`}
      {...props}
    />
  );
};

export default Input;
