import React from 'react';

const Input = ({ placeholder, type = 'text', className = '', ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full py-2 px-4 bg-slate-200 text-slate-900 rounded-md placeholder-slate-500 focus:ring-2 focus:ring-slate-500 outline-none transition-all duration-300 ${className}`}
      {...props}
    />
  );
};

export default Input;
