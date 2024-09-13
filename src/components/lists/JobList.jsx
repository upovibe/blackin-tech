// import React, { useEffect, useState } from 'react';
// import { getAllDocuments } from '../../services/firestoreService';
// import { Link } from 'react-router-dom';
// import Lottie from 'lottie-react';
// import animationData from '../../assets/animations/Animation - No Data Found.json';
// import imageLoadingAnimation from '../../assets/animations/Animation - Image Loading.json';

// const JobList = ({ filters }) => {
//   const [jobs, setJobs] = useState([]);
//   const [loadingImages, setLoadingImages] = useState({});

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const jobData = await getAllDocuments('jobs');

//         // Filter logic based on filters prop
//         const filteredJobs = jobData.filter(job => {
//           const matchesLocation = filters.location 
//             ? job.location?.toLowerCase().includes(filters.location.toLowerCase()) 
//             : true;

//           const matchesJobType = filters.jobType 
//             ? job.jobType === filters.jobType 
//             : true;

//           const matchesRemote = filters.remote ? job.remote === true : true;

//           return matchesLocation && matchesJobType && matchesRemote;
//         });

//         setJobs(filteredJobs);
//       } catch (error) {
//         console.error('Error fetching jobs: ', error);
//       }
//     };

//     fetchJobs();
//   }, [filters]);

//   const handleImageLoad = (jobId) => {
//     setLoadingImages(prevState => ({
//       ...prevState,
//       [jobId]: false,
//     }));
//   };

//   const handleImageLoading = (jobId) => {
//     setLoadingImages(prevState => ({
//       ...prevState,
//       [jobId]: true,
//     }));
//   };

//   return (
//     <div className="job-list">
//       {jobs.length > 0 ? (
//         jobs.map((job) => (
//           <div key={job.id} className="job-item mb-4 p-4 border-b">
//             <h2>{job.title}</h2>
//             <p>{job.subtitle}</p>
//             <p>{job.location}</p>
//             <p><strong>Job Type:</strong> {job.jobType}</p>

//             {job.media && job.media[0] && (
//               <div className="job-image-wrapper">
//                 {loadingImages[job.id] ? (
//                   <Lottie 
//                     animationData={imageLoadingAnimation} 
//                     className="w-32 h-32" // Adjust size of the animation
//                   />
//                 ) : null}

//                 <img 
//                   src={job.media[0]} 
//                   alt={job.title} 
//                   className="job-image" 
//                   onLoad={() => handleImageLoad(job.id)} 
//                   onLoadStart={() => handleImageLoading(job.id)}
//                   style={loadingImages[job.id] ? { display: 'none' } : {}}
//                 />
//               </div>
//             )}

//             <Link to={`/jobs/${job.slug}`} className="view-details">
//               View Details
//             </Link>
//             <button className="apply-button">Apply Now</button>
//           </div>

//         ))
//       ) : (
//         <div className="no-jobs-found mt-6 flex flex-col items-center">
//           <Lottie 
//             animationData={animationData} 
//             className="w-64 h-64" // Adjust size of the animation
//           />
//           <p className="mt-4 text-center text-gray-500">
//             No jobs found matching your filters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobList;


import React, { useEffect, useState } from 'react';
import { getAllDocuments } from '../../services/firestoreService';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/Animation - No Data Found.json';
import imageLoadingAnimation from '../../assets/animations/Animation - Image Loading.json';
import { FaMapLocation } from 'react-icons/fa6';
import { FaMapMarker } from 'react-icons/fa';

const JobList = ({ filters }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await getAllDocuments('jobs');

        // Filter logic based on filters prop
        const filteredJobs = jobData.filter(job => {
          const matchesLocation = filters.location
            ? job.location?.toLowerCase().includes(filters.location.toLowerCase())
            : true;

          const matchesJobType = filters.jobType
            ? job.jobType === filters.jobType
            : true;

          const matchesRemote = filters.remote ? job.remote === true : true;

          return matchesLocation && matchesJobType && matchesRemote;
        });

        setJobs(filteredJobs);
      } catch (error) {
        console.error('Error fetching jobs: ', error);
      }
    };

    fetchJobs();
  }, [filters]);

  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} onClick={() => navigate(`/jobs/${job.slug}`)}  className="job-item relative p-2 mb-5 bg-slate-100 w-full rounded-xl cursor-pointer overflow-hidden border-2 border-slate-600/10">
            <div  className="flex items-start gap-3">
              <div className="job-image-wrapper size-16 min-h-16 min-w-16 relative overflow-hidden rounded-lg shadow cursor-pointer group">
                {job.media && job.media[0] ? (
                  <img
                    src={job.media[0]}
                    alt={job.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Lottie
                    animationData={imageLoadingAnimation}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className='flex items-center justify-between w-full'>
                <div className=''>
                <h2 className='font-semibold leading-tight text-lg hover:decoration-slice transition all duration-300 ease-in-out'>{job.title}</h2>
                <p className='truncate'>{job.subtitle}</p>
                </div>
                <div className='flex flex-col items-center text-sm font-semibold space-y-2'>
                <span className='flex items-center gap-2 px'><FaMapMarker/>{job.location}</span>
                <span className='px-2 bg-slate-400 rounded-full text-white'>{job.jobType}</span>
                </div>
              </div>
            </div>
            <div className='absolute bg-slate-100 top-0 right-0 p-2 rounded-l-lg size-full md:w-1/2 items-center gap-2 justify-center overflow-hidden flex'>              

            <Link to={`/jobs/${job.slug}`} className="view-details p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out">
              View Details
            </Link>
            <button className="apply-button p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out">Apply Now</button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-jobs-found mt-6 flex flex-col items-center">
          <Lottie
            animationData={animationData}
            className="w-64 h-64" // Adjust size of the animation
          />
          <p className="mt-4 text-center text-gray-500">
            No jobs found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobList;
