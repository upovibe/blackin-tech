import React, { useState } from 'react';
import JobList from '../components/lists/JobList';
import JobFilter from '../components/filters/JobFilter';
import Lottie from 'lottie-react';
import animationData from '../assets/animations/Animation - TechJobs.json'

const Jobs = () => {
  const [filters, setFilters] = useState({
    location: '',
    specialties: [],
    jobType: '',
    remote: false,
  });

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  return (
    <main className='w-screen h-auto'>
      <section className='flex justify-center items-center'>
        <div className="container py-16 px-2 md:px-0">
          <div className=' flex flex-col space-y-6 items-center justify-center px-0 md:px-20 lg:px-80'>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-center font-serif">
              Your Gateway to Tech Opportunities
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-center text-gray-600 max-w-3xl mx-auto">
              Discover tech roles that value diversity and inclusion. At BlackIn Tech, we connect Black professionals with top-tier companies in Germany looking for talent in software development, data science, cybersecurity, and more.
            </p>
          </div>
        </div>
      </section>
      <section className='flex justify-center items-center'>
        <div className="container flex items-start flex-col md:flex-row py-16 px-2 md:px-0 w-full gap-10">
          <div className='w-full md:w-1/4 space-y-16'>
            <JobFilter onFilterChange={handleFilterChange} />
            <Lottie animationData={animationData} loop={true} className="w-full h-full" />
          </div>
          <div className='w-full md:w-3/4'>
            <JobList filters={filters} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Jobs;
