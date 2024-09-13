import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../contexts/AuthContext';
import Input from '../common/Input';
import SelectInput from '../common/SelectInput';
import TextArea from '../common/TextArea';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import Button from '../common/Button'; 
import Toast from '../common/Toast'; 
import Lottie from 'lottie-react'; 
import successAnimation from '../../assets/animations/Animation - JobPosted.json'; 
import { createDocument } from '../../services/firestoreService';
import { fetchCountries, fetchJobTypes } from '../../api/jobsApi';
import ImagesUpload from '../common/ImagesUpload';
import { uploadImages } from '../../services/storageService';

const JobForm = () => {
  const { user } = UserAuth();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    location: '',
    jobType: '',
    description: '',
  });

  const [countries, setCountries] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [showToast, setShowToast] = useState({ visible: false, message: '', type: 'success' });
  const [success, setSuccess] = useState(false); 
  const [media, setMedia] = useState([]); // State to store uploaded images

  useEffect(() => {
    fetchCountries().then(setCountries);
    fetchJobTypes().then(setJobTypes);
  }, []);

  // Function to generate slug from job title
  const generateSlug = (title) => {
    return title
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/(^-|-$)/g, ''); // Remove any leading or trailing hyphens
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!formData.title || !formData.location || !formData.jobType || !formData.description) {
      setShowToast({
        visible: true,
        message: 'Please fill in all the required fields',
        type: 'error'
      });
      setLoading(false);
      return;
    }
  
    try {
      let mediaUrls = [];
  
      if (media.length > 0) {
        mediaUrls = await uploadImages(media);
      }
  
      const slug = generateSlug(formData.title); // Generate slug from title

      const jobData = {
        ...formData,
        createdAt: new Date(),
        media: mediaUrls,
        createdBy: user.uid, // Add the user ID here
        slug, // Add the slug to the jobData object
      };
  
      await createDocument('jobs', jobData);
  
      setSuccess(true);
      setShowToast({
        visible: true,
        message: 'Job posted successfully!',
        type: 'success',
      });
  
      setFormData({
        title: '',
        subtitle: '',
        location: '',
        jobType: '',
        description: '',
      });
      setMedia([]); 
  
    } catch (error) {
      setShowToast({
        visible: true,
        message: 'Failed to post the job. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  

  const closeToast = () => {
    setShowToast({ ...showToast, visible: false });
  };

  return (
    <div className="relative h-max p-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <TextArea
          name="subtitle"
          placeholder="Brief description of the job"
          value={formData.subtitle}
          onChange={handleInputChange}
          rows={3}
        />

        <SelectInput
          name="location"
          options={countries.map((country) => ({ label: country, value: country }))}
          placeholder="Select Country"
          onChange={handleInputChange}
          value={formData.location}
          required
        />

        <SelectInput
          name="jobType"
          options={jobTypes.map((type) => ({ label: type, value: type }))}
          placeholder="Select Job Type"
          onChange={handleInputChange}
          value={formData.jobType}
          required
        />

        <ReactQuill
          value={formData.description}
          onChange={(content) => setFormData({ ...formData, description: content })}
          placeholder="Add more info on Salary, Required Qualifications, Company Overview, Benefits, etc."
          className="bg-slate-200 text-slate-900 rounded-md"
        />

        <ImagesUpload setMedia={setMedia} /> {/* Image Upload Component */}

        <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          {loading ? 'Posting...' : 'Post Job'}
        </Button>
      </form>

      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Lottie className='size-full' animationData={successAnimation} loop={false} />
        </div>
      )}

      <Toast
        type={showToast.type}
        message={showToast.message}
        visible={showToast.visible}
        onClose={closeToast}
      />
    </div>
  );
};

export default JobForm;
