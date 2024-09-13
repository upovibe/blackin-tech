import React, { useState } from 'react';
import JobList from '../components/lists/JobList';
import JobFilter from '../components/filters/JobFilter';
import Button from '../components/common/Button';

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
    <>
      <main className='w-screen'>
        <section className='w-full flex items-center justify-center py-16'>
          
        </section>
        <section className='w-full flex items-center justify-center'>
          <div className="container p-0 px-2 md:py-2 flex flex-col-reverse lg:flex-row gap-10">
            {/* Main content for job listings */}
            <div className="lg:w-3/4 size-full">
              <JobList filters={filters} />
            </div>
            {/* Sidebar for Filters */}
            <aside className="lg:w-1/4 size-full">
              <JobFilter onFilterChange={handleFilterChange} />
            </aside>
          </div>
        </section>
      </main>
    </>

  );
};

export default Jobs;
