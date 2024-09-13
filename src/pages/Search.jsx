import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchInput from '../components/filters/SearchInput';
import SearchResult from '../components/views/SearchResult';
import { getAllDocuments } from '../services/firestoreService';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query'); // Extract query from URL
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (query) {
        try {
          const allJobs = await getAllDocuments('jobs'); // Fetch all jobs from Firestore
          const filteredJobs = allJobs.filter((job) =>
            // Check if any of the fields (title, subtitle, location, jobType, description) match the query
            job.title?.toLowerCase().includes(query.toLowerCase()) ||
            job.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
            job.location?.toLowerCase().includes(query.toLowerCase()) ||
            job.jobType?.toLowerCase().includes(query.toLowerCase()) ||
            job.description?.toLowerCase().includes(query.toLowerCase())
          );
          setJobs(filteredJobs);
        } catch (error) {
          console.error('Error fetching jobs: ', error);
        }
      }
    };

    fetchJobs();
  }, [query]);

  return (
    <div className="search-page">
      {/* Search input for the search page */}
      <SearchInput />

      {/* Display search results using the SearchResult component */}
      <SearchResult jobs={jobs} query={query} />
    </div>
  );
};

export default Search;

