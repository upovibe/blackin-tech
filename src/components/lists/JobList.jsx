import React, { useEffect, useState } from 'react';
import { getAllDocuments } from '../../services/firestoreService';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/Animation - Jobs.json';
import imageLoadingAnimation from '../../assets/animations/Animation - Image Loading.json';
import { FaMapMarker, FaUserCircle } from 'react-icons/fa';
import { UserAuth } from '../../contexts/AuthContext';
import { timeSince } from '../../utils/timingUtils';
import Toast from '../common/Toast'

// Truncate text function
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const JobList = ({ filters }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [titleLength, setTitleLength] = useState(30);
  const [subtitleLength, setSubtitleLength] = useState(50);
  const { user } = UserAuth(); // Get user from context

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await getAllDocuments('jobs');
        const filteredJobs = jobData.filter(job => {
          const matchesLocation = filters.location
            ? job.location?.toLowerCase().includes(filters.location.toLowerCase())
            : true;
          const matchesJobType = filters.jobType
            ? job.jobType === filters.jobType
            : true;
          const matchesRemote = filters.remote ? job.remote === true : true;
          return matchesLocation && matchesJobType && matchesRemote;
        }).map(job => ({
          ...job,
          createdAt: job.createdAt?.toDate ? job.createdAt.toDate() : new Date(job.createdAt) // Convert Firestore timestamp
        }));
        setJobs(filteredJobs);
      } catch (error) {
        console.error('Error fetching jobs: ', error);
      }
    };


    fetchJobs();
  }, [filters]);

  // Adjust truncation based on screen size
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setTitleLength(screenWidth < 640 ? 20 : screenWidth < 1024 ? 25 : 30);
      setSubtitleLength(screenWidth < 640 ? 30 : screenWidth < 1024 ? 40 : 50);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => navigate(`/jobs/${job.slug}`)}
            className="job-item relative p-2 mb-5 bg-slate-100 w-full rounded-xl cursor-pointer overflow-hidden border-2 border-slate-500/10"
          >
            <div className="flex items-center gap-3 h-full">
              <div className="job-image-wrapper size-20 min-h-20 min-w-20 md:size-16 md:min-h-16 md:min-w-16 relative overflow-hidden rounded-lg shadow cursor-pointer">
                {job.media && job.media[0] ? (
                  <img
                    src={job.media[0]}
                    alt={job.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <Lottie
                    animationData={imageLoadingAnimation}
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Content wrapper */}
              <div className="flex items-center justify-between w-full h-full gap-3">
                <div className="flex flex-col justify-between h-full">
                  <h2 className="font-semibold leading-tight text-lg">
                    {truncateText(job.title, titleLength)}
                  </h2>
                  <p className="truncate">{truncateText(job.subtitle, subtitleLength)}</p>
                  <span className="px-2 bg-slate-400 rounded-full text-white text-xs font-semibold py-0 inline-flex w-fit md:hidden mt-3">
                    {job.jobType}
                  </span>
                  <div className="hidden md:inline-flex items-center relative group text-xs font-semibold text-slate-700 space-x-1 mt-1">
                    {/* Display author's name with hover tooltip */}
                    <FaUserCircle />
                    <span>{user?.userName || 'Unknown Author'}</span>

                    {/* Tooltip div, only shown on hover */}
                    <div className="absolute left-0 buttom-full z-50 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-3 py-1 leading-tight font-semibold">
                      Featured listing posted by Admin <span>{timeSince(new Date(job.createdAt))}</span>

                    </div>
                  </div>
                </div>
                <div className="hidden flex-col items-center text-sm font-semibold space-y-2 md:flex h-full justify-between">
                  <span className="flex items-center gap-2">
                    <FaMapMarker />
                    {job.location}
                  </span>
                  <span className="px-2 py-0 bg-slate-400 rounded-full text-white leading-tight">
                    {job.jobType}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply View - initially hidden, visible on hover */}
            <div className="apply-view absolute bg-slate-100 top-0 right-0 p-2 rounded-l-lg size-full lg:w-8/12 items-center gap-2 justify-end overflow-hidden flex opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out">
              <Link
                to={`/jobs/${job.slug}`}
                className="view-details p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out"
              >
                View Details
              </Link>
              <button className="apply-button p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out">
                Apply Now
              </button>
              <button
                className="apply-button p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out"
                onClick={(event) => {
                  event.stopPropagation(); // Prevents the parent div's onClick from firing
                  console.log('Job saved');
                }}
              >
                Save Job
              </button>
            </div>
          </div>

        ))
      ) : (
        <div className="no-jobs-found mt-6 flex flex-col items-center">
          <Lottie animationData={animationData} className="w-64 h-64" />
        </div>
      )}
    </div>
  );
};

export default JobList;
