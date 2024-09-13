import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/Animation - No Data Found.json';

const SearchResult = ({ jobs, query }) => {
  return (
    <div className="job-results mt-6">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="job-item mb-4 p-4 border-b">
             <Link to={`/jobs/${job.slug}`} className="view-details">
              View Details
            </Link>
            <button className="apply-button">Apply Now</button>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p>{job.subtitle}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Job Type:</strong> {job.jobType}</p>
            {/* Display job media images if they exist */}
            {job.media && job.media.length > 0 && (
              <img
                src={job.media[0]} // Display the first image
                alt={job.title}
                className="w-full max-w-sm mt-2"
              />
            )}
          </div>
        ))
      ) : (
        <div className="no-results mt-6 flex flex-col items-center">
          <Lottie 
            animationData={animationData} 
            className="w-64 h-64" // Adjust size as necessary
          />
          <p className="mt-4 text-center text-gray-500">
            No results found for "{query}".
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
