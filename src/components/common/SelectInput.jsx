import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';

const SelectInput = ({ options, placeholder, className, ...rest }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectChange = (value) => {
    setInputValue(value);
    setIsOpen(false);
    if (rest.onChange) {
      rest.onChange({ target: { name: rest.name, value } }); // Notify parent component of the selection
    }
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="bg-blue-200">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        type="text"
        value={inputValue}
        onClick={handleInputClick}
        readOnly // Make the input field read-only
        placeholder={placeholder}
        className={`cursor-pointer ${className}`}
        {...rest}
      />
      {isOpen && (
        <ul className="absolute z-50 w-full bg-white border border-slate-300 rounded-md mt-1 max-h-48 overflow-y-auto transition-all duration-300">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelectChange(option.label)}
                className="p-2 hover:bg-slate-200 cursor-pointer transition-all duration-300"
              >
                {highlightText(option.label, inputValue)}
              </li>
            ))
          ) : (
            <li className="p-2 text-slate-400">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectInput;
