import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllDocuments } from '../../services/firestoreService';


const JobDetails = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobBySlug = async () => {
      try {
        const jobs = await getAllDocuments('jobs');
        const jobData = jobs.find((job) => job.slug === slug);
        setJob(jobData);
      } catch (error) {
        console.error('Error fetching job details: ', error);
      }
    };

    fetchJobBySlug();
  }, [slug]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-details">
      <h1>{job.title}</h1>
      <h3>{job.subtitle}</h3>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Job Type:</strong> {job.jobType}</p>
      <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }}></div>
      
      {/* Display uploaded images */}
      {job.media && job.media.length > 0 && (
        <div className="job-images">
          {job.media.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Job image ${index + 1}`}
              className="job-image"
              style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}
            />
          ))}
        </div>
      )}

      <button className="apply-button">Apply for this job</button>
    </div>
  );
};

export default JobDetails;