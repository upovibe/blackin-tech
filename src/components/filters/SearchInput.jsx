import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; 
import Input from '../common/Input';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-input flex items-center">
      <div className="big-screen relative w-full hidden md:flex">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full pr-5"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black/50 p-0 bg-transparent hover:bg-transparent"
          onClick={handleSearch}
        >
          <FaSearch />
        </button>
      </div>
      <button 
        className="small-screen text-black/50 p-2 rounded-lg hover:text-slate-700 hover:bg-slate-400/25 transition-colors duration-300 ease-in-out md:hidden" 
        onClick={handleSearch}
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchInput;
