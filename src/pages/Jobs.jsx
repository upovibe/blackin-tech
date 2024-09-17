import React, { useState, useEffect } from 'react';
import JobList from '../components/lists/JobList';
import JobFilter from '../components/filters/JobFilter';
import Lottie from 'lottie-react';
import animationData from '../assets/animations/Animation - TechJobs.json';
import pageloading from '../assets/animations/Animation - LoadingPage.json'; // Your loading animation
import HorizontalLineWithText from '../components/common/HorizontalLineWithText';
import { FaFilter, FaBriefcase } from 'react-icons/fa6';

const Jobs = () => {
  const [filters, setFilters] = useState({
    location: '',
    specialties: [],
    jobType: '',
    remote: false,
  });

  const [showFilter, setShowFilter] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);


    const fetchData = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(fetchData);
  }, []);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Lottie animationData={pageloading} loop={true} className="w-48 h-48" />
      </div>
    );
  }

  return (
    <main className='w-screen h-auto'>
      <section className='flex justify-center items-center'>
        <div className="container pt-16 px-2 md:px-0">
          <div className='flex flex-col space-y-6 items-center justify-center px-0 md:px-20 lg:px-40 xl:px-60'>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-center font-serif">
              Your Gateway to Tech Opportunities
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-center text-gray-600 max-w-3xl mx-auto">
              Discover tech roles that value diversity and inclusion. At BlackIn Tech, we connect Black professionals with top-tier companies in Germany looking for talent in software development, data science, cybersecurity, and more.
            </p>
            <Lottie animationData={animationData} loop={true} className="size-48 md:hidden block" />
          </div>
          <div className='w-full flex justify-center items-center mt-16'>
            <HorizontalLineWithText>Opportunities Await</HorizontalLineWithText>
          </div>
        </div>
      </section>

      <section className='flex justify-center items-center'>
        <div className="container flex md:items-start flex-col md:flex-row py-16 px-2 md:px-0 w-full gap-10">
          {/* Filter button for small screens */}
          <button
            className="items-center space-x-2 px-4 py-1 md:hidden flex border rounded-full text-sm font-sm transition-all duration-300 ml-auto"
            onClick={toggleFilter}
          >
            <FaFilter />
            <span>Filters</span>
          </button>

          {/* Filter Section */}
          <div className={`w-full md:w-3/6 lg:w-2/6 space-y-16 ${showFilter ? 'block' : 'hidden'} md:block`}>
            <JobFilter onFilterChange={handleFilterChange} />
            <Lottie animationData={animationData} loop={true} className="w-full h-full hidden md:block" />
          </div>

          {/* Job List Section */}
          <div className='w-full'>
            <div className='flex justify-between items-center mb-5'>
              <button 
                className='flex items-center space-x-2 px-4 py-2 border rounded-full text-sm font-sm transition-all duration-300' 
                onClick={handleRefresh}
              >
                <FaBriefcase />
                <span>JobBoard</span>
              </button>
              <p className='text-xl font-bold leading-tight'>Recent job posts</p>
            </div>
            <JobList filters={filters} key={refreshKey} /> {/* Passing refreshKey to re-render JobList */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Jobs;
