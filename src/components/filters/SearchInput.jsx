import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; 
import Input from '../common/Input';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Handle search when user presses enter or clicks the button
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  // Update search term on input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle 'Enter' key press in the search input field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-input flex items-center w-full">
      <div className="big-screen relative w-full hidden md:flex">
        <Input
          type="search"
          placeholder="Search for jobs..."
          className="w-full pr-5"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
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
