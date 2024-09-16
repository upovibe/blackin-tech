import React, { useEffect, useState } from 'react';
import { getAllDocuments, getSavedJobs, saveJob, removeSavedJob } from '../../services/firestoreService';
import { getUserById } from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/Animation - Jobs.json';
import imageLoadingAnimation from '../../assets/animations/Animation - Image Loading.json';
import { FaMapMarker, FaUserCircle } from 'react-icons/fa';
import { UserAuth } from '../../contexts/AuthContext';
import { timeSince } from '../../utils/timingUtils';
import Modal from '../common/Modal';
import JobApplicationForm from '../forms/JobApplicationForm';
import Toast from '../common/Toast';
import Pagination from '../common/Pegination';
import Tooltip from '../common/TooltIP.JSX';

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const JobList = ({ filters }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [titleLength, setTitleLength] = useState(30);
  const [subtitleLength, setSubtitleLength] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jobsPerPage] = useState(10);
  const { user } = UserAuth();

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Modal state for handling job application form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Function to handle job saving
  const handleSaveJob = async (jobId) => {
    if (user) {
      try {
        await saveJob(user.uid, jobId);
        setSavedJobs((prevSavedJobs) => new Set([...prevSavedJobs, jobId]));
        setToastMessage('Job saved successfully!');
        setToastType('success');
        setToastVisible(true);
      } catch (error) {
        console.error('Error saving job: ', error);
        setToastMessage('Failed to save the job.');
        setToastType('error');
        setToastVisible(true);
      }
    } else {
      alert('You must be logged in to save jobs.');
    }
  };

  // Function to handle job removal
  const handleRemoveJob = async (jobId) => {
    if (user) {
      try {
        await removeSavedJob(user.uid, jobId);
        setSavedJobs((prevSavedJobs) => {
          const updatedSavedJobs = new Set(prevSavedJobs);
          updatedSavedJobs.delete(jobId);
          return updatedSavedJobs;
        });
        setToastMessage('Job removed successfully!');
        setToastType('success');
        setToastVisible(true);
      } catch (error) {
        console.error('Error removing job: ', error);
        setToastMessage('Failed to remove the job.');
        setToastType('error');
        setToastVisible(true);
      }
    } else {
      alert('You must be logged in to remove jobs.');
    }
  };

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

  // Fetch jobs with pagination
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const allJobs = await getAllDocuments('jobs');
        const filteredJobs = await Promise.all(allJobs
          .filter((job) => {
            const matchesLocation = filters.location
              ? job.location?.toLowerCase().includes(filters.location.toLowerCase())
              : true;
            const matchesJobType = filters.jobType
              ? job.jobType === filters.jobType
              : true;
            const matchesRemote = filters.remote ? job.remote === true : true;
            return matchesLocation && matchesJobType && matchesRemote;
          })
          .map(async (job) => {
            const jobPoster = await getUserById(job.postedBy);
            return {
              ...job,
              createdAt: job.createdAt?.toDate ? job.createdAt.toDate() : new Date(job.createdAt),
              posterUsername: jobPoster ? jobPoster.userName : 'Unknown Author'
            };
          }));

        setTotalPages(Math.ceil(filteredJobs.length / jobsPerPage));
        const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
        setJobs(paginatedJobs);
      } catch (error) {
        console.error('Error fetching jobs: ', error);
      }
    };

    fetchJobs();
  }, [filters, currentPage, jobsPerPage]);


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

  const handleModalOpen = (job) => {
    if (user) {
      setSelectedJob(job);
      setIsModalOpen(true);
    } else {
      setToastMessage('You must be logged in to apply for a job.');
      setToastType('error');
      setToastVisible(true);
      navigate('/login');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

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
                  <Tooltip position='right' text={`Featured listing posted by Admin ${timeSince(new Date(job.createdAt))}`}>
                    <span className="text-xs font-semibold text-slate-700 space-x-1 mt-1 flex items-center gap-1">
                      <FaUserCircle /> {job.posterUsername}
                    </span>
                  </Tooltip>
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
            <div className="apply-view absolute bg-slate-100 top-0 right-0 p-2 rounded-l-lg size-full lg:w-8/12 items-center gap-2 justify-end overflow-hidden flex opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <Link
                to={`/jobs/${job.slug}`}
                className="view-details p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out"
              >
                View Details
              </Link>
              <button
                className="apply-button p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out"
                onClick={(event) => {
                  event.stopPropagation();
                  handleModalOpen(job);
                }}
              >
                Apply Now
              </button>
              {savedJobs.has(job.id) ? (
                <button
                  className="remove-button p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveJob(job.id);
                  }}
                >
                  Remove Job
                </button>
              ) : (
                <button
                  className="save-button p-1 px-2 text-sm rounded-full border-2 border-slate-600/25 hover:bg-slate-800 hover:text-white/80 transition-all duration-300 ease-in-out"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSaveJob(job.id);
                  }}
                >
                  Save Job
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="no-jobs-found mt-6 flex flex-col items-center">
          <Lottie animationData={animationData} className="w-64 h-64" />
          <p>No jobs found for this tab.</p>
        </div>
      )}

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal for Job Application */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Apply for Job">
        <JobApplicationForm job={selectedJob} />
      </Modal>

      {/* Toast Notification */}
      <Toast
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default JobList;
