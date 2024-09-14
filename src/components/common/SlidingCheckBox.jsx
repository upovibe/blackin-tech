import React from 'react';

const SlidingCheckbox = ({ id, name, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={`relative flex items-center cursor-pointer w-14 h-7 rounded-full transition-colors duration-300 ${
          checked ? 'bg-blue-500' : 'bg-slate-500'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </label>
    </div>
  );
};

export default SlidingCheckbox;
