import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchInput from '../components/filters/SearchInput';
import SearchResult from '../components/views/SearchResult';
import { getAllDocuments } from '../services/firestoreService';
import Lottie from 'lottie-react';
import noDataAnimation from '../assets/animations/Animation - No Data Found.json';
import pageloading from '../assets/animations/Animation - LoadingPage.json';
import HorizontalLineWithText from '../components/common/HorizontalLineWithText'

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (query) {
        setLoading(true);
        try {
          const allJobs = await getAllDocuments('jobs');

          // Filter jobs based on the query
          const filteredJobs = allJobs.filter((job) =>
          (job.title?.toLowerCase().includes(query.toLowerCase()) ||
            job.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
            job.location?.toLowerCase().includes(query.toLowerCase()) ||
            job.jobType?.toLowerCase().includes(query.toLowerCase()) ||
            job.description?.toLowerCase().includes(query.toLowerCase()))
          );

          setJobs(filteredJobs);
        } catch (error) {
          console.error('Error fetching jobs: ', error);
          setError('An error occurred while fetching jobs.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobs();
  }, [query]);

  return (
    <main>
      <section>
        <div className="w-full bg-gradient-to-r from-slate-300 to-slate-500 p-2 relative h-16">
          {/* Centered Content with custom positioning */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[5%] p-3 bg-slate-200 w-5/6 md:w-1/2 xl:w-2/6 rounded-lg shadow">
            <SearchInput />
          </div>
        </div>
      </section>
      <section className='flex items-center justify-center'>
        <div className="container py-20 px-2 md:px-0">
          <div className='py-10'>
          <HorizontalLineWithText
            htmlText={`You searched for <span class="font-bold">${query}</span>`}
          />
          </div>

          <div className="search-results">
            {/* Handle Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-screen">
                <Lottie animationData={pageloading} className="size-40" />
              </div>
            )}

            {/* Handle Errors */}
            {error && <p>{error}</p>}

            {/* Display Search Results or No Results Message */}
            {!loading && !error && (
              jobs.length > 0 ? (
                <div className=''>                  
                <SearchResult jobs={jobs} query={query} />
                </div>
              ) : (
                <div>
                  <Lottie
                    animationData={noDataAnimation}
                    className="w-64 h-64 mx-auto" // Adjust size as necessary
                  />
                  <p className="text-center text-gray-500">
                    No results found for "{query}".
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Search;
