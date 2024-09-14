import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllDocuments } from '../../services/firestoreService';
import { UserAuth } from '../../contexts/AuthContext';
import { FaWhatsapp, FaFacebook, FaLinkedin, FaLink, FaSave } from 'react-icons/fa';
import Lottie from 'lottie-react';
import LoadingPage from '../../assets/animations/Animation - LoadingPage.json';
import Toast from '../common/Toast';
import { timeSince } from '../../utils/timingUtils';
import NavigationButtons from '../common/NavigationButton';
import { FaX } from 'react-icons/fa6';
import Divider from '../common/Divider';
import HrizontalLineWithText from '../common/HorizontalLineWithText';
import Button from '../common/Button';
import HorizontalLineWithText from '../common/HorizontalLineWithText';

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
    <main>
      <section>
        <div className='container mx-auto py-4'>
          <NavigationButtons />
        </div>
        <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:justify-center gap-8">
          <div className="lg:w-2/4">
            <div className="text-lg font-semibold mb-3">Company Details</div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
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
                <h3 className="text-sm text-gray-500 mb-4">{job.subtitle}</h3>
              </div>
            )}

            {/* Social Sharing Buttons */}
            <HrizontalLineWithText text='Share' className='my-4' />
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

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(message)}&via=YourTwitterHandle`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black flex items-center gap-2 border-2 p-2 md:py-1 bg-slate-300/50 border-slate-300/20 rounded-full"
              >
                <FaX />
                <span className="text-slate-900 font-semibold text-xs hidden md:block">X/Twitter</span>
              </a>

              <button onClick={handleCopyLink} className="flex items-center gap-2 border-2 p-2 md:py-1 bg-slate-300/50 border-slate-300/20 rounded-full">
                <FaLink />
                <span className="text-slate-900 font-semibold text-xs hidden md:block">Copy</span>
              </button>
            </div>

            <Divider direction="horizontal" className="my-5 opacity-25" />


            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold">About the Company</div>
              <div className="mb-14 p-1 bg-slate-50 rounded-lg" dangerouslySetInnerHTML={{ __html: job.description }}></div>
            </div>
            {/* Social Sharing Buttons */}
            <div className="w-full flex items-center justify-between">
              <Button className=''>
                Apply Now
              </Button>
              <Button className=''>
                Save Job
              </Button>
            </div>
          </div>

          {/* Right Section - Author Details and Latest Jobs */}
          <div className="lg:w-1/4 border-0 border-t-2 lg:border-t-0 lg:border-l-2 pt-20 lg:pt-0 lg:pl-10 my-10">
            <div className="mb-8 border-2 border-slate-300/50 rounded-xl p-10">
              <div className='flex flex-col items-center justify-center'>
                <img
                  src={job.logo || 'default_logo.png'}
                  alt="Company Logo"
                  className="w-24 h-24 rounded-full mx-auto lg:mx-0 lg:mb-4"
                />
                <h4 className="text-xl font-semibold">{job.companyName || 'Unknown Company'}</h4>
                <a
                  href={job.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/80 text-sm hover:text-black semibold block mt-2 transition-all duration-300 ease-in-out"
                >
                  {job.website ? 'Visit Website' : 'No Website Available'}
                </a>
                <Button className="mt-4">
                  Apply for this job
                </Button>
              </div>
              <Divider direction="horizontal" className="my-8 opacity-25" />
              <div className='space-y-2'>
                <p className="text-left"><strong>Location:</strong> {job.location}</p>
                <p className=""><strong>Job Type:</strong> {job.jobType}</p>
              </div>
              <div className='flex flex-col items-center justify-start mt-5'>
                <HorizontalLineWithText
                  className='text-sm font-semibold'
                  text={`${user.role} posted ${timeSince(new Date(job.createdAt))}`}
                />
              </div>
            </div>


            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">Latest Jobs</h4>
              <ul className="list-none space-y-2">
                {latestJobs.map((latestJob) => (
                  <li key={latestJob.id}>
                    <Link
                      to={`/jobs/${latestJob.slug}`}
                      onClick={() => navigate(`/jobs/${latestJob.slug}`, { replace: false })}
                      className="text-blue-600 hover:underline transition-all duration-200 ease-in-out"
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
      </section>
    </main>
  );
};

export default JobDetails;
