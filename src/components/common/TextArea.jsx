import React, { forwardRef } from 'react';

const TextArea = forwardRef(({
  label,
  placeholder = '',
  value,
  onChange,
  rows = 4,
  maxLength = 500,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="">
      {label && <label className="block text-slate-700 text-sm font-bold mb-2">{label}</label>}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full py-1.5 px-3 bg-slate-200 text-slate-900 rounded-md placeholder-slate-500 border-2 border-slate-300/15 focus:border-transparent focus:border-slate-500 focus:ring-2 focus:ring-slate-300 outline-none transition-all duration-300 ${className}`}
        {...rest}
      />
    </div>
  );
});

// Add a display name for easier debugging
TextArea.displayName = 'TextArea';

export default TextArea;
