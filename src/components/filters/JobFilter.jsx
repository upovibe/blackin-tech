import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import SelectInput from '../common/SelectInput';
import { getAllDocuments } from '../../services/firestoreCRUD'; // Firestore fetch function
import HorizontalLineWithText from '../common/HorizontalLineWithText';

const JobFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    remote: false,
  });

  const [jobTypes, setJobTypes] = useState([]);

  // Fetch job types from Firestore on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getAllDocuments('jobTypes');
        const formattedTypes = types.map(type => ({
          label: type.name, // Display the job type name
          value: type.slug, // Use slug or ID as value
        }));
        setJobTypes(formattedTypes);
      } catch (error) {
        console.error('Error fetching job types from Firestore:', error);
      }
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
    <div className="bg-slate-100 p-2 border-2 border-slate-500/10 rounded-lg">
      <HorizontalLineWithText>Filter by location</HorizontalLineWithText>
      <div className="">
        <Input
          name="location"
          placeholder="Type Location"
          value={filters.location}
          onChange={handleInputChange}
          className="border mt-2 p-2 w-full rounded"
        />
      </div>

      <HorizontalLineWithText>Filter by Job Type</HorizontalLineWithText>
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

      <div className="flex items-center justify-between gap-3 mt-8">
        <button
          onClick={handleFilterSubmit}
          className="w-full bg-slate-500 text-white p-1 rounded-lg hover:bg-slate-950 transition-all duration-300 ease-in-out"
        >
          Filter
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full bg-gray-200 text-gray-700 p-1 rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default JobFilter;
