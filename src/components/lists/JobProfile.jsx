import React, { useEffect, useState } from 'react';
import { getAppliedJobs, getAllSavedJobsWithDetails, getPostedJobsByUser, getJobDetails } from '../../services/firestoreJobManagement';
import { UserAuth } from '../../contexts/AuthContext';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animations/Animation - Loading.json';
import noDataAnimation from '../../assets/animations/Animation - No Data Found.json';
import animationData from '../../assets/animations/Animation - Jobs.json';
import Toast from '../common/Toast';
import { FaRegBookmark, FaBookmark, FaMapMarker, FaBriefcase, FaEye, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import { saveJob, removeSavedJob, incrementJobViewCount } from '../../services/firestoreJobManagement';
import { Link } from 'react-router-dom';
import Tooltip from '../common/Tooltip';

const JobProfile = ({ tab }) => {
  const { user } = UserAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobStates, setJobStates] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [buttonLoading, setButtonLoading] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let jobList = [];
        if (tab === 'Applied') {
          const applications = await getAppliedJobs(user.uid);
          jobList = await Promise.all(applications.map(async (application) => {
            const jobDetails = await getJobDetails(application.jobId);
            return { ...application, ...jobDetails };
          }));
        } else if (tab === 'Saved') {
          jobList = await getAllSavedJobsWithDetails(user.uid);
          setSavedJobs(new Set(jobList.map(job => job.id)));
        } else if (tab === 'Posted' && user.role === 'admin') {
          jobList = await getPostedJobsByUser(user.uid);
        }
        setJobs(jobList);

        // Initialize job states
        const states = {};
        for (const job of jobList) {
          states[job.id] = { viewCount: job.viewCount || 0, saveCount: job.saveCount || 0 };
        }
        setJobStates(states);
      } catch (error) {
        console.error(`Error fetching ${tab}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [tab, user]);

  const handleSaveJob = async (jobId) => {
    if (user) {
      setButtonLoading(jobId); // Set loading for the specific job
      try {
        await saveJob(user.uid, jobId);
        setSavedJobs((prevSavedJobs) => new Set([...prevSavedJobs, jobId]));

        setJobStates((prevStates) => ({
          ...prevStates,
          [jobId]: { ...prevStates[jobId], saveCount: prevStates[jobId].saveCount + 1 }
        }));

        setToastMessage('Job saved successfully!');
        setToastType('success');
        setToastVisible(true);
      } catch (error) {
        console.error('Error saving job: ', error);
        setToastMessage('Failed to save the job.');
        setToastType('error');
        setToastVisible(true);
      } finally {
        setButtonLoading(null); // Clear loading state
      }
    } else {
      setToastMessage('Sign in to get started!');
      setToastType('error');
      setToastVisible(true);
    }
  };

  const handleRemoveJob = async (jobId) => {
    if (user) {
      setButtonLoading(jobId); // Set loading for the specific job
      try {
        await removeSavedJob(user.uid, jobId);
        setSavedJobs((prevSavedJobs) => {
          const updatedSavedJobs = new Set(prevSavedJobs);
          updatedSavedJobs.delete(jobId);
          return updatedSavedJobs;
        });

        setJobStates((prevStates) => ({
          ...prevStates,
          [jobId]: { ...prevStates[jobId], saveCount: prevStates[jobId].saveCount - 1 }
        }));

        setToastMessage('Job removed successfully!');
        setToastType('success');
        setToastVisible(true);
      } catch (error) {
        console.error('Error removing job: ', error);
        setToastMessage('Failed to remove the job.');
        setToastType('error');
        setToastVisible(true);
      } finally {
        setButtonLoading(null); // Clear loading state
      }
    } else {
      setToastMessage('Sign in to get started!');
      setToastType('error');
      setToastVisible(true);
    }
  };


  // Increment view count for each job when loaded
  useEffect(() => {
    const incrementViewCount = async () => {
      if (jobs && jobs.length > 0) {
        for (const job of jobs) {
          try {
            if (!job.id) continue; // Skip if no job id
            await incrementJobViewCount(job.id);
            setJobStates((prevStates) => ({
              ...prevStates,
              [job.id]: { ...prevStates[job.id], viewCount: prevStates[job.id].viewCount + 1 }
            }));
          } catch (error) {
            console.error(`Error incrementing view count for job ${job.id}:`, error);
          }
        }
      }
    };
    incrementViewCount();
  }, [jobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <Lottie animationData={animationData} className="w-64 h-64" />
        <p>Loading {tab}...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Lottie animationData={noDataAnimation} className="w-64 h-64" />
        <p>No jobs {tab}</p>
      </div>
    );
  }

  return (
    <div className="job-profile-results flex flex-wrap gap-5">
      {jobs.map((job) => (
        <div key={job.id} className="job-item flex-1 min-w-[300px] p-4 relative">
          {/* Job Media */}
          {job.media && job.media.length > 0 && (
            <div className="relative w-full h-64 overflow-hidden rounded-md group bg-black bg-opacity-0 transition-opacity duration-300 ease-in-out group-hover:bg-opacity-50">
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
                  {/* Save Button */}
                  <div className='flex items-center justify-center w-max gap-1'>
                    {buttonLoading === job.id ? (
                      <Lottie animationData={loadingAnimation} className="w-6 h-6" /> // Show loading animation for this job
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
          {/* Job Details */}
          <div className="flex items-center justify-between text-sm text-black/80 font-semibold mt-2">
            <div className='flex items-center gap-2'>
              <span className="flex items-center gap-1">
                <FaUserCircle />
                {job.posterUsername || 'Unknown Author'}
              </span>
              {/* Applied Job Details */}
              {tab === 'Applied Jobs' && (
                <div className='flex items-center gap-2'>
                  <Tooltip position='right' text={`Application submitted! Applied at ${new Date(job.appliedAt.seconds * 1000).toLocaleDateString()}`}>
                    <span className="flex items-center gap-1 bg-green-600 hover:shadow-md rounded-full px-2 py-1 text-sm font-bold leading-tight text-white cursor-pointer">
                     <FaCheckCircle/> Applied
                    </span>
                  </Tooltip>

                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="flex items-center gap-1">{jobStates[job.id]?.viewCount || 0} <FaEye /></span>
              <span className="flex items-center gap-1">{jobStates[job.id]?.saveCount || 0} <FaBookmark /></span>
            </div>
          </div>
        </div>
      ))}

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

export default JobProfile;



// import React, { useEffect, useState } from 'react';
// import { getAppliedJobs, getAllSavedJobsWithDetails, getPostedJobsByUser, getJobDetails } from '../../services/firestoreJobManagement';
// import { UserAuth } from '../../contexts/AuthContext';
// import LoadingPage from '../../assets/animations/Animation - Loading.json';
// import noDataAnimation from '../../assets/animations/Animation - No Data Found.json';
// import pageloading from '../../assets/animations/Animation - LoadingPage.json';
// import Toast from '../common/Toast';
// import Pagination from '../common/Pagination';
// import Tooltip from '../common/Tooltip';
// import { FaRegBookmark, FaBookmark, FaMapMarker, FaBriefcase, FaEye, FaUserCircle } from 'react-icons/fa';
// import { getUserById } from '../../services/authService';
// import { getSavedJobs, saveJob, removeSavedJob, incrementJobViewCount } from '../../services/firestoreJobManagement';

// const JobProfile = ({ tab }) => {
//   const { user } = UserAuth();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       if (!user || !user.uid) {
//         console.error('User is not authenticated or UID is missing');
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         let jobList = [];
//         console.log('Fetching jobs for user ID:', user.uid);
//         if (tab === 'Applied Jobs') {
//           const applications = await getAppliedJobs(user.uid);
//           jobList = await Promise.all(applications.map(async (application) => {
//             const jobDetails = await getJobDetails(application.jobId);
//             return { ...application, ...jobDetails };
//           }));
//         } else if (tab === 'Saved Jobs') {
//           jobList = await getAllSavedJobsWithDetails(user.uid);
//         } else if (tab === 'Posted Jobs' && user.role === 'admin') {
//           jobList = await getPostedJobsByUser(user.uid);
//         }
//         console.log('Fetched jobs:', jobList);
//         setJobs(jobList);
//       } catch (error) {
//         console.error(`Error fetching ${tab}:`, error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, [tab, user, user.uid, user.role]);

//   if (loading) {
//     return <p>Loading {tab}...</p>;
//   }

//   if (jobs.length === 0) {
//     return <p>No jobs found for {tab}</p>;
//   }

//   return (
//     <div>
//       <h3>{tab}</h3>
//       <ul>
//         {jobs.map((job) => (
//           <li key={job.id}>
//             <h4>{job.title || 'No Title Available'}</h4>
//             <img
//                   src={job.media[0]}
//                   alt={job.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
//                 />
//             {tab === 'Applied Jobs' && (
//               <>
//                 <p>Applied At: {job.appliedAt ? new Date(job.appliedAt.seconds * 1000).toLocaleDateString() : 'Date Not Available'}</p>
//                 <p>Email: {job.email || 'No Email Available'}</p>
//                 <p>Phone: {job.phone || 'No Phone Available'}</p>
//                 <p>Resume: <a href={job.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
//                 {/* Add other applied job-specific details here */}
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default JobProfile;



