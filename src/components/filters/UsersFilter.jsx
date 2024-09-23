import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import SelectInput from "../common/SelectInput";
import { getAllDocuments } from "../../services/firestoreCRUD";
import { FaSearch } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";

const UsersFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    availability: "",
  });

  const [locations, setLocations] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);

  // Fetch locations and availabilities from Firestore on component mount
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        // Fetch locations from the users table or other relevant sources
        const fetchedLocations = await getAllDocuments("locations"); // Replace with correct collection
        const formattedLocations = fetchedLocations.map((loc) => ({
          label: loc.city + ", " + loc.country, // Display location as "City, Country"
          value: loc.city, // You can change this to more specific location formats
        }));
        setLocations(formattedLocations);

        // Fetch availabilities from jobAvailabilities collection
        const fetchedAvailabilities = await getAllDocuments(
          "jobAvailabilities"
        );
        const formattedAvailabilities = fetchedAvailabilities.map(
          (availability) => ({
            label: availability.name,
            value: availability.slug,
          })
        );
        setAvailabilities(formattedAvailabilities);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFiltersData();
  }, []);

  const handleInputChange = (e) => {
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
      keyword: "",
      location: "",
      availability: "",
    });
    onFilterChange({
      keyword: "",
      location: "",
      availability: "",
    });
  };

  // Handle Enter key press in the input field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleFilterSubmit();
    }
  };

  return (
<div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 p-3 bg-slate-200 rounded-lg shadow-md">
  {/* Search Input - Aligned to the left */}
  <div className="w-full md:w-4/12">
    <Input
      name="keyword"
      placeholder="Search by professional title, skills, abilities, etc."
      value={filters.keyword}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown} // Listen for Enter key press
      className="border w-full rounded p-2"
    />
  </div>

  {/* Filters and Buttons - Aligned to the right */}
  <div className="flex items-center justify-center md:justify-end gap-3 ">
    {/* Filter by location */}
    <div className="flex w-full">        
    <SelectInput
      name="location"
      options={locations}
      placeholder="Select Location"
      value={filters.location}
      onChange={handleInputChange}
      className=""
    />

    {/* Filter by availability */}
    <SelectInput
      name="availability"
      options={availabilities}
      placeholder="Select Availability"
      value={filters.availability}
      onChange={handleInputChange}
      className=""
    />
    </div>

    {/* Submit and Clear Buttons */}
    <div className="flex items-center gap-2">
      <button
        onClick={handleFilterSubmit}
        className="bg-slate-500 text-white hover:bg-slate-950 transition-all duration-300 ease-in-out rounded-lg size-9 flex items-center justify-center"
      ><FaSearch/>
      </button>
      <button
        onClick={handleClearFilters}
        className="bg-gray-200 text-gray-700 rounded-lg size-9 flex items-center justify-center"
      ><FaRotate/>
      </button>
    </div>
  </div>
</div>

  );
};

export default UsersFilter;
