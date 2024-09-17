import React, { useState, useEffect, useRef } from 'react';
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
import { createDocument } from '../../services/firestoreCRUD';
import { getUserById } from '../../services/authService';
import { fetchCountries, fetchJobTypes } from '../../api/jobsApi';
import ImagesUpload from '../common/ImagesUpload';
import { uploadImages } from '../../services/storageService';
import AvatarUpload from '../common/AvatarUpload';
import SlidingCheckbox from '../common/SlidingCheckbox';
import CompanyLogo from '../../assets/images/company-logo.png';

const JobForm = () => {
  const { user } = UserAuth();
  const [formData, setFormData] = useState({
    logo: '',
    companyName: '',
    website: '',
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
  const [media, setMedia] = useState([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const quillRef = useRef(null);

  useEffect(() => {
    fetchCountries().then(setCountries);
    fetchJobTypes().then(setJobTypes);
  }, []);

  const fetchPosterUsername = async (uid) => {
    try {
      const userDoc = await getUserById(uid);
      return userDoc.userName || 'Unknown Author';
    } catch (error) {
      console.error('Error fetching user:', error);
      return 'Unknown Author';
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (url) => {
    setFormData({ ...formData, logo: url });
    setLogoError(false);
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

    // Check if logo is provided
    if (!formData.logo) {
      setLogoError(true); // Show error for missing logo
      setFormData({ ...formData, logo: CompanyLogo }); // Use default logo
      setLoading(false);
      return;
    }

    try {
      let mediaUrls = [];

      if (media.length > 0) {
        mediaUrls = await uploadImages(media);
      }

      const slug = generateSlug(formData.title);
      const username = await fetchPosterUsername(user.uid);

      const jobData = {
        ...formData,
        createdAt: new Date(),
        media: mediaUrls,
        postedBy: user.uid,
        posterUsername: username,
        slug,
      };

      await createDocument('jobs', jobData);

      setSuccess(true);
      setShowToast({
        visible: true,
        message: 'Job posted successfully!',
        type: 'success',
      });

      setFormData({
        logo: '',
        companyName: '',
        website: '',
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
        <div>
          <label className={`block text-sm font-medium ${logoError ? 'text-red-600' : 'text-gray-700'} mb-2`}>
            Company Logo {logoError && <span>(Required)</span>}
          </label>
          <AvatarUpload onUpload={handleLogoUpload} />
          {logoError && <p className="text-red-600 text-sm">Please upload a company logo.</p>}
        </div>

        <Input
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleInputChange}
          required
        />

        <Input
          name="website"
          placeholder="Company Website (optional)"
          value={formData.website}
          onChange={handleInputChange}
        />

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
          ref={quillRef}
          value={formData.description}
          onChange={(content) => setFormData({ ...formData, description: content })}
          placeholder="Add more info on Salary(optional), Required Qualifications, Company Overview, Benefits, etc."
          className="bg-slate-200 text-slate-900 rounded-md"
        />

        <div className="flex items-center mt-4">
          <SlidingCheckbox
            id="media-toggle"
            name="showMediaUpload"
            checked={showMediaUpload}
            onChange={() => setShowMediaUpload(!showMediaUpload)}
          />
          <span className="ml-3 text-sm font-medium text-gray-700">Upload Images (Optional)</span>
        </div>
        {showMediaUpload && (
          <ImagesUpload setMedia={setMedia} />
        )}

        <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          {loading ? 'Posting...' : 'Post Job'}
        </Button>
      </form>

      {success && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lottie className='w-1/2' animationData={successAnimation} loop={false} />
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
