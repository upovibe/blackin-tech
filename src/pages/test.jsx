import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllDocuments, getSavedJobs, saveJob, removeSavedJob, updateDocument } from '../../services/firestoreService';
import { UserAuth } from '../../contexts/AuthContext';
import { FaWhatsapp, FaFacebook, FaLinkedin, FaLink, FaBookmark, FaEye } from 'react-icons/fa';
import Lottie from 'lottie-react';
import LoadingPage from '../../assets/animations/Animation - LoadingPage.json';
import Toast from '../common/Toast';
import { timeSince } from '../../utils/timingUtils';
import NavigationButtons from '../common/NavigationButton';
import { FaX } from 'react-icons/fa6';
import Divider from '../common/Divider';
import HrizontalLineWithText from '../common/HorizontalLineWithText';
import Button from '../common/Button';
import Modal from '../common/Modal';
import JobApplicationForm from '../forms/JobApplicationForm';
import Tooltip from '../common/Tooltip';

const JobDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [latestJobs, setLatestJobs] = useState([]);
  const { user } = UserAuth();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobBySlug = async () => {
      try {
        const jobs = await getAllDocuments('jobs');
        const jobData = jobs.find((job) => job.slug === slug);

        if (jobData && jobData.createdAt) {
          jobData.createdAt = jobData.createdAt.toDate
            ? jobData.createdAt.toDate()
            : new Date(jobData.createdAt);
        }

        // Ensure jobData contains viewCount and saveCount
        setJob({
          ...jobData,
          viewCount: jobData.viewCount || 0,
          saveCount: jobData.saveCount || 0,
        });

        const latestJobList = jobs
          .filter((j) => j.slug !== slug)
          .slice(0, 4);
        setLatestJobs(latestJobList);
      } catch (error) {
        console.error('Error fetching job details: ', error);
      }
    };

    fetchJobBySlug();
  }, [slug]);

  // Increment the view count when the job is loaded
  useEffect(() => {
    const incrementViewCount = async () => {
      if (job) {
        try {
          await updateDocument('jobs', job.id, { viewCount: increment(1) });
        } catch (error) {
          console.error('Error incrementing view count: ', error);
        }
      }
    };

    incrementViewCount();
  }, [job]);

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

  const handleSaveJob = async (jobId) => {
    if (user) {
      try {
        await saveJob(user.uid, jobId);

        // Increment the save count
        await updateDocument('jobs', jobId, { saveCount: increment(1) });

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

  const handleRemoveJob = async (jobId) => {
    if (user) {
      try {
        await removeSavedJob(user.uid, jobId);

        // Decrement the save count
        await updateDocument('jobs', jobId, { saveCount: increment(-1) });

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage('Link copied to clipboard!');
    setToastType('success');
    setToastVisible(true);
  };

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

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={LoadingPage} loop className="w-48 h-48" />
      </div>
    );
  }

  const pageUrl = window.location.href;
  const message = `Check out this job: ${job?.title || 'Job Title'} at ${job?.companyName || 'Company'} - ${pageUrl}`;

  return (
    <main>
      <section>
        <div className="container mx-auto py-4">
          <NavigationButtons />
        </div>
        <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:justify-center gap-8">
          <div className="lg:w-3/4 xl:w-2/4">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            {/* Social Sharing Buttons */}
            <HrizontalLineWithText text="Share" className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 flex items-center gap-2 border-2 p-2 md:py-1 bg-slate-300/50 border-slate-300/20 rounded-full"
                >
                  <FaWhatsapp />
                  <span className="text-slate-900 font-semibold text-xs hidden md:block">WhatsApp</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 flex items-center gap-2 border-2 p-2 md:py-1 bg-slate-300/50 border-slate-300/20 rounded-full"
                >
                  <FaFacebook />
                  <span className="text-slate-900 font-semibold text-xs hidden md:block">Facebook</span>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(job.title)}&summary=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 flex items-center gap-2 border-2 p-2 md:py-1 bg-slate-300/50 border-slate-300/20 rounded-full"
                >
                  <FaLinkedin />
                  <span className="text-slate-900 font-semibold text-xs hidden md:block">LinkedIn</span>
                </a>
                <Tooltip position="bottom" text="Copy link">
                  <button
                    onClick={handleCopyLink}
                    className="text-slate-500 flex items-center gap-2 border-2 p-2 md:py-1 bg-slate-300/50 border-slate-300/20 rounded-full"
                  >
                    <FaLink />
                    <span className="text-slate-900 font-semibold text-xs hidden md:block">Copy Link</span>
                  </button>
                </Tooltip>
              </div>
              <div className="flex items-center gap-3">
                {/* Display view count */}
                <Tooltip position="left" text="Click to see more details">
                  <span className="flex items-center gap-1 text-sm">
                    {job.viewCount || 0} <FaEye />
                  </span>
                </Tooltip>

                {/* Display save count */}
                <Tooltip position="left" text="Number of saves">
                  <span className="flex items-center gap-1 text-sm text-slate-700">
                    {job.saveCount || 0} <FaBookmark />
                  </span>
                </Tooltip>
              </div>
            </div>

            <Divider />
            <div className="my-4">
              <span className="text-slate-500 text-sm">
                Posted {timeSince(job.createdAt)} by{' '}
                <span className="font-bold">{job.companyName}</span>
              </span>
              <p className="text-slate-900 my-4">{job.description}</p>
            </div>

            <HrizontalLineWithText text="Job Details" className="my-4" />
            <div className="my-4">
              <p className="text-slate-500 text-sm">Location: {job.location}</p>
              <p className="text-slate-500 text-sm">Salary: {job.salary}</p>
              <p className="text-slate-500 text-sm">Experience Level: {job.experienceLevel}</p>
            </div>

            <Button
              text={savedJobs.has(job.id) ? 'Unsave Job' : 'Save Job'}
              onClick={() => {
                savedJobs.has(job.id) ? handleRemoveJob(job.id) : handleSaveJob(job.id);
              }}
              className="my-4"
            />

            <Button
              text="Apply Now"
              onClick={() => handleModalOpen(job)}
              className="bg-blue-600 text-white"
            />

            {isModalOpen && selectedJob && (
              <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <JobApplicationForm job={selectedJob} onClose={handleModalClose} />
              </Modal>
            )}
          </div>
        </div>
      </section>

      {toastVisible && (
        <Toast
          message={toastMessage}
          type={toastType}
          visible={toastVisible}
          setVisible={setToastVisible}
        />
      )}
    </main>
  );
};

export default JobDetails;
