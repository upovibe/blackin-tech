import React, { useEffect, useState } from 'react';
import { getAppliedJobs, getAllSavedJobsWithDetails, getPostedJobsByUser, getJobDetails } from '../../services/firestoreJobManagement';
import { UserAuth } from '../../contexts/AuthContext';

const JobProfile = ({ tab }) => {
  const { user } = UserAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !user.uid) {
        console.error('User is not authenticated or UID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let jobList = [];
        console.log('Fetching jobs for user ID:', user.uid);
        if (tab === 'Applied Jobs') {
          const applications = await getAppliedJobs(user.uid);
          jobList = await Promise.all(applications.map(async (application) => {
            const jobDetails = await getJobDetails(application.jobId);
            return { ...application, ...jobDetails };
          }));
        } else if (tab === 'Saved Jobs') {
          jobList = await getAllSavedJobsWithDetails(user.uid);
        } else if (tab === 'Posted Jobs' && user.role === 'admin') {
          jobList = await getPostedJobsByUser(user.uid);
        }
        console.log('Fetched jobs:', jobList);
        setJobs(jobList);
      } catch (error) {
        console.error(`Error fetching ${tab}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [tab, user.uid, user.role]);

  if (loading) {
    return <p>Loading {tab}...</p>;
  }

  if (jobs.length === 0) {
    return <p>No jobs found for {tab}</p>;
  }

  return (
    <div>
      <h3>{tab}</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h4>{job.title || 'No Title Available'}</h4>
            <p>{job.description || 'No Description Available'}</p>
            {tab === 'Applied Jobs' && (
              <>
                <p>Applied At: {job.appliedAt ? new Date(job.appliedAt.seconds * 1000).toLocaleDateString() : 'Date Not Available'}</p>
                <p>Email: {job.email || 'No Email Available'}</p>
                <p>Phone: {job.phone || 'No Phone Available'}</p>
                <p>Resume: <a href={job.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                {/* Add other applied job-specific details here */}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobProfile;
