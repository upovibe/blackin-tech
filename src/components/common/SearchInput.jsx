import React from 'react';
import { FaSearch } from 'react-icons/fa'; 
import Input from './Input';
import Button from './Button';

const SearchInput = () => {
  return (
    <div className="relative w-full md:w-64 flex">
      {/* Input component for the search field */}
      <Input
        type="search"
        placeholder="Search..."
        className="pr-12 w-ful"
      />
      {/* Search button with icon */}
      <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-slate-700 hover:bg-slate-800 transition-all duration-300 rounded-md">
        <FaSearch />
      </Button>
    </div>
  );
};

export default SearchInput;
