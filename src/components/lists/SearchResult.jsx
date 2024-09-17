import { React, useState, useEffect } from 'react';
import { UserAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import noDataAnimation from '../../assets/animations/Animation - No Data Found.json';
import loadingAnimation from '../../assets/animations/Animation - Loading.json';
import { FaRegBookmark, FaBookmark, FaMapMarker, FaBriefcase, FaEye, FaUserCircle } from 'react-icons/fa';
import { getUserById } from '../../services/authService';
import { getSavedJobs, saveJob, removeSavedJob, incrementJobViewCount } from '../../services/firestoreJobManagement';
import Toast from '../common/Toast';

const SearchResult = ({ jobs, query }) => {
  const [savedJobs, setSavedJobs] = useState(new Set());
  const { user } = UserAuth();
  const [posterUsernames, setPosterUsernames] = useState({});
  const [jobStates, setJobStates] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  

  // Fetch saved jobs when the user logs in or when the component mounts
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user) {
        try {
          const savedJobsData = await getSavedJobs(user.uid);
          setSavedJobs(new Set(savedJobsData));
        } catch (error) {
          console.error('Error fetching saved jobs: ', error);
        }
      }
    };
    fetchSavedJobs();
  }, [user]);

  // Fetch poster usernames for each job
  useEffect(() => {
    const fetchPosterUsernames = async () => {
      const usernames = {};
      const states = {};
      for (const job of jobs) {
        if (job.postedBy) { // Check if postedBy exists
          try {
            const jobPoster = await getUserById(job.postedBy);
            usernames[job.id] = jobPoster?.userName || 'Unknown Author';
            states[job.id] = { viewCount: job.viewCount || 0, saveCount: job.saveCount || 0 };
          } catch (error) {
            console.error(`Error fetching username for job ${job.id}: `, error);
            usernames[job.id] = 'Unknown Author';
          }
        } else {
          // Handle cases where job.postedBy is missing or undefined
          usernames[job.id] = 'Unknown Author';
          states[job.id] = { viewCount: job.viewCount || 0, saveCount: job.saveCount || 0 };
        }
      }
      setPosterUsernames(usernames);
      setJobStates(states);
    };
  
    if (jobs.length > 0) {
      fetchPosterUsernames();
    }
  }, [jobs]);
  

  // Function to handle job saving
const handleSaveJob = async (jobId) => {
  if (user) {
    setLoading(true);
    try {
      await saveJob(user.uid, jobId);
      setSavedJobs((prevSavedJobs) => new Set([...prevSavedJobs, jobId]));

      // Increment save count locally
      setJobStates((prevStates) => ({
        ...prevStates,
        [jobId]: { ...prevStates[jobId], saveCount: prevStates[jobId].saveCount + 1 }
      }));

      setToastMessage('Job saved successfully!');
      setToastType('success'); // Set to 'success' on success
      setToastVisible(true);
    } catch (error) {
      console.error('Error saving job: ', error);
      setToastMessage('Failed to save the job.');
      setToastType('error'); // Set to 'error' on failure
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  } else {
    setToastMessage('Sign in to get started!');
    setToastType('error'); // Set to 'error' when the user is not signed in
    setToastVisible(true);
  }
};

// Function to handle job removal
const handleRemoveJob = async (jobId) => {
  if (user) {
    setLoading(true);
    try {
      await removeSavedJob(user.uid, jobId);
      setSavedJobs((prevSavedJobs) => {
        const updatedSavedJobs = new Set(prevSavedJobs);
        updatedSavedJobs.delete(jobId);
        return updatedSavedJobs;
      });

      // Decrement save count locally
      setJobStates((prevStates) => ({
        ...prevStates,
        [jobId]: { ...prevStates[jobId], saveCount: prevStates[jobId].saveCount - 1 }
      }));

      setToastMessage('Job removed successfully!');
      setToastType('success'); // Set to 'success' on success
      setToastVisible(true);
    } catch (error) {
      console.error('Error removing job: ', error);
      setToastMessage('Failed to remove the job.');
      setToastType('error'); // Set to 'error' on failure
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  } else {
    setToastMessage('Sign in to get started!');
    setToastType('error'); // Set to 'error' when the user is not signed in
    setToastVisible(true);
  }
};



  // Increment view count for each job when loaded
  useEffect(() => {
    const incrementViewCount = async () => {
      if (jobs) {
        for (const job of jobs) {
          try {
            await incrementJobViewCount(job.id);
            setJobStates((prevStates) => ({
              ...prevStates,
              [job.id]: { ...prevStates[job.id], viewCount: prevStates[job.id].viewCount + 1 }
            }));
          } catch (error) {
            console.error('Error incrementing view count: ', error);
          }
        }
      }
    };

    incrementViewCount();
  }, [jobs]);

  return (
    <div className="job-results flex flex-wrap gap-2">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="job-item flex-1 min-w-[300px] mb-4 p-4 relative">
            {/* Show media if available */}
            {job.media && job.media.length > 0 && (
              <div className='relative w-full h-64 overflow-hidden rounded-md group bg-black bg-opacity-0 transition-opacity duration-300 ease-in-out group-hover:bg-opacity-50'>
                <img
                  src={job.media[0]}
                  alt={job.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
                />
                <div className="absolute w-full p-2 inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50 cursor-pointer flex flex-col justify-between">
                  <div className='flex items-center justify-between opacity-0 group-hover:opacity-100 text-white transition-all'>
                    <span className='flex items-center gap-1 bg-white py-1 px-3 rounded-full shadow text-black'><FaMapMarker />{job.location}</span>
                    <span className='flex items-center gap-1'><FaBriefcase />{job.jobType}</span>
                  </div>
                  <div className="w-full opacity-0 group-hover:opacity-100 text-white transition-all flex items-end justify-between">
                    <Link to={`/jobs/${job.slug}`} className="text-lg font-semibold hover:underline hover:text-blue-200">
                      <h3>{job.title}</h3>
                    </Link>
                    {/* Save and remove */}
                    <div className='flex items-center justify-center w-max gap-1'>
                      {loading ? (
                        <Lottie animationData={loadingAnimation} className="w-6 h-6" /> // Show loading animation
                      ) : (
                        <button
                          className='p-2 rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300 ease-in-out'
                          onClick={() => (savedJobs.has(job.id) ? handleRemoveJob(job.id) : handleSaveJob(job.id))}
                        >
                          {savedJobs.has(job.id) ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='flex items-center justify-between text-sm text-black/80 font-semibold'>
              {/* Display posterUsername from state */}
              <span className='flex items-center gap-1'>
                <FaUserCircle />
                {posterUsernames[job.id] || 'Unknown Author'}
              </span>
              <div className='flex items-center justify-center gap-2'>
                <span className='flex items-center gap-1'>{jobStates[job.id]?.viewCount || 0}<FaEye /></span>
                <span className='flex items-center gap-1'>{jobStates[job.id]?.saveCount || 0}<FaBookmark /></span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-results-found mt-6 flex flex-col items-center">
          <Lottie animationData={noDataAnimation} className="w-64 h-64" />
          <p>No results found</p>
        </div>
      )}

     {/* Toast Notification */}
     <Toast
        role="alert"
        aria-live="assertive"
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default SearchResult;
