import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllDocuments } from '../../services/firestoreService';
import { UserAuth } from '../../contexts/AuthContext';
import { FaWhatsapp, FaFacebook, FaLinkedin, FaLink, FaTwitter } from 'react-icons/fa';
import Lottie from 'lottie-react';
import LoadingPage from '../../assets/animations/Animation - LoadingPage.json';
import Toast from '../common/Toast';
import { timeSince } from '../../utils/timingUtils';
import NavigationButtons from '../common/NavigationButton';

const JobDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate(); // For back navigation
  const { user } = UserAuth();
  const [job, setJob] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

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

        setJob(jobData);

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


  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast({
      visible: true,
      message: 'Link copied to clipboard!',
      type: 'success',
    });
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  const isImageUrl = (url) => {
    const urlWithoutParams = url.split("?")[0];
    const imageExtensions = /\.(jpeg|jpg|gif|png)$/i;
    return imageExtensions.test(urlWithoutParams);
  };

  const getGridClass = (count) => {
    switch (count) {
      case 1:
        return "grid-cols-1 grid-rows-1";
      case 2:
        return "grid-cols-2 grid-rows-1 gap-2";
      case 3:
        return "grid-cols-2 grid-rows-[auto] gap-2";
      case 4:
        return "grid-cols-2 grid-rows-2 gap-2";
      default:
        return "";
    }
  };

  const pageUrl = window.location.href;
  const message = `Check out this job: ${job?.title || 'Job Title'} at ${job?.companyName || 'Company'} - ${pageUrl}`;

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={LoadingPage} loop className="w-48 h-48" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:justify-between gap-8">

      {/* Back Button */}
      {/* Left Section - Job Details */}
      <div className="lg:w-3/4">
        <div className="w-full">
          <NavigationButtons />
        </div>
        <div className="text-lg font-semibold">Company Details</div>

        {/* Display uploaded images */}
        {job.media && job.media.length > 0 && (
          <div className={`grid justify-center ${getGridClass(job.media.length)} mt-3`}>
            {job.media.map((url, index) => (
              <div
                key={index}
                className={`relative flex justify-center items-center ${job.media.length === 1
                  ? "w-full h-full"
                  : job.media.length === 3 && index === 0
                    ? "col-span-2 w-full"
                    : "w-full"
                  }`}
              >
                <div className="w-full h-96 flex justify-center items-center overflow-hidden shadow-md rounded-lg">
                  {isImageUrl(url) ? (
                    <img
                      src={url}
                      alt={`media-${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold">{job.title}</h1>
        <h3 className="text-xl text-gray-500 mb-4">{job.subtitle}</h3>

        {/* Posted Time */}
        <p className="text-sm text-gray-500 mb-4">
          <span>{timeSince(new Date(job.createdAt))}</span>
        </p>

        <div className="mb-6" dangerouslySetInnerHTML={{ __html: job.description }}></div>

        {/* Social Sharing Buttons */}
        <div className="flex gap-4 mb-6">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 text-2xl"
          >
            <FaWhatsapp />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-2xl"
          >
            <FaFacebook />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(job.title)}&summary=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-2xl"
          >
            <FaLinkedin />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(message)}&via=YourTwitterHandle`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-2xl"
          >
            <FaTwitter />
          </a>
          <button onClick={handleCopyLink} className="text-gray-600 text-2xl">
            <FaLink />
          </button>
        </div>
      </div>

      {/* Right Section - Author Details and Latest Jobs */}
      <div className="lg:w-1/4 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pl-6">
        <div className="mb-8 text-center lg:text-left">
          <img
            src={job.logo || 'default_logo.png'}
            alt="Company Logo"
            className="w-24 h-24 rounded-full mx-auto lg:mx-0 lg:mb-4"
          />
          <h4 className="text-xl font-semibold">{job.companyName || 'Unknown Company'}</h4>
          <p className="text-sm text-gray-500">{user?.userName || 'Unknown Author'}</p>
          <a
            href={job.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline block mt-2"
          >
            {job.website ? 'Visit Website' : 'No Website Available'}
          </a>
          <p className="mb-2"><strong>Location:</strong> {job.location}</p>
          <p className="mb-4"><strong>Job Type:</strong> {job.jobType}</p>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Apply for this job
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4">Latest Jobs</h4>
          <ul className="list-none space-y-2">
            {latestJobs.map((latestJob) => (
              <li key={latestJob.id}>
                <Link
                  to={`/jobs/${latestJob.slug}`}
                  onClick={() => navigate(`/jobs/${latestJob.slug}`, { replace: false })}
                  className="text-blue-600 hover:underline"
                >
                  {latestJob.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
};

export default JobDetails;
