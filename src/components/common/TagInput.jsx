import React, { useState } from 'react';
import Input from './Input';

const TagInput = ({ options, placeholder, onChange, maxTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    filterOptions(value);
  };

  const filterOptions = (value) => {
    if (value) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleSelectOption = (option) => {
    if (selectedTags.includes(option) || (maxTags && selectedTags.length >= maxTags)) {
      return;
    }
    const updatedTags = [...selectedTags, option];
    setSelectedTags(updatedTags);
    setInputValue('');
    setFilteredOptions([]);
    onChange(updatedTags);
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(updatedTags);
    onChange(updatedTags);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 border min-h-[3rem] max-h-full pl-[1px] rounded-lg border-slate-300 bg-slate-200">
        {selectedTags.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1 m-1 rounded-full flex items-center gap-2 font-semibold">
            {tag}
            <button type="button" onClick={() => handleRemoveTag(tag)} className="text-blue-600 hover:text-blue-800">
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 border-none outline-none focus:ring-0 p-1 bg-transparent text-slate-900 placeholder-slate-500"
          disabled={maxTags && selectedTags.length >= maxTags}
        />
      </div>
      {filteredOptions.length > 0 && (
        <ul className="absolute z-50 bg-white border border-slate-300 rounded-md mt-1 max-h-60 overflow-y-auto w-full transition-all duration-300">
          {filteredOptions.map(option => (
            <li
              key={option}
              onClick={() => handleSelectOption(option)}
              className="p-2 flex items-center cursor-pointer hover:bg-slate-200 transition-all duration-300"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(option)}
                onChange={() => handleSelectOption(option)}
                className="mr-2"
              />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
