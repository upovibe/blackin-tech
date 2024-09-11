import React from 'react';

const Checkbox = ({ label, checked, onChange, name }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
      />
      <label htmlFor={name} className="ml-2 text-slate-900">{label}</label>
    </div>
  );
};

export default Checkbox;
