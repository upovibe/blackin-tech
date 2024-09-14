import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import SelectInput from '../common/SelectInput';
import { fetchJobTypes } from '../../api/jobsApi'; 
import HorizontalLineWithText from '../common/HorizontalLineWithText';
import Button from '../common/Button';

const JobFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    remote: false,
  });

  const [jobTypes, setJobTypes] = useState([]);

  // Fetch job types from API on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      const types = await fetchJobTypes();
      const formattedTypes = types.map(type => ({ label: type, value: type }));
      setJobTypes(formattedTypes);
    };
    fetchTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleFilterSubmit = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      remote: false,
    });
    onFilterChange({
      location: '',
      jobType: '',
      remote: false,
    });
  };

  return (
    <div className=" bg-slate-100 p-2 border-2 border-slate-600/10 shadow-md rounded-lg">
      <HorizontalLineWithText text="Filter by location" />
      <div className="">
        <Input
          name="location"
          placeholder="Type Location"
          value={filters.location}
          onChange={handleInputChange}
          className="border mt-2 p-2 w-full rounded"
        />
      </div>
      <HorizontalLineWithText text="Filter by Job Type" />
      <div className="">
        <SelectInput
          name="jobType"
          options={jobTypes}
          placeholder="Select Job Type"
          value={filters.jobType}
          onChange={handleSelectChange}
          className="border mt-2 p-2 w-full rounded"
        />
      </div>
      <div className='flex items-center justify-between gap-3 mt-3'>
      <Button
        onClick={handleFilterSubmit}
        className="mt-4 w-full bg-slate-500 text-white p-2 rounded-lg"
      >
        Filter
      </Button>
      <button
        onClick={handleClearFilters}
        className="mt-2 w-full bg-gray-200 text-gray-700 p-2 rounded-lg"
      >
        Clear Filters
      </button>
      </div>      
    </div>
  );
};

export default JobFilter;
