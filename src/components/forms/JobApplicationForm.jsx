import React, { useState } from 'react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import DocsUpload from '../common/DocsUpload';
import Toast from '../common/Toast';
import Lottie from 'lottie-react';
import successAnimation from '../../assets/animations/Animation - ApplicationSubmitted.json';
import { createDocument } from '../../services/firestoreService';
import { UserAuth } from '../../contexts/AuthContext';

const JobApplicationForm = () => {
  const { user } = UserAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: '',
    aboutYou: '',
    resume: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeUpload = (fileUrls) => {
    setFormData((prev) => ({
      ...prev,
      resume: fileUrls[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Check if required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.resume) {
      setError('Please fill out all required fields.');
      setSubmitting(false);
      // Display error toast
      setToast({
        visible: true,
        message: 'Please fill out all required fields.',
        type: 'error',
      });
      return;
    }

    try {
      // Add user data along with their UID to Firestore
      await createDocument('jobApplications', {
        ...formData,
        userId: user.uid, // Store user UID
        appliedAt: new Date(),
      });

      // Display success toast and show Lottie animation
      setToast({
        visible: true,
        message: 'Your application has been successfully submitted!',
        type: 'success',
      });
      setSuccess(true); // Trigger success animation

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        website: '',
        aboutYou: '',
        resume: '',
      });
    } catch (error) {
      console.error("Error submitting the application:", error);
      // Display error toast
      setToast({
        visible: true,
        message: 'Failed to submit your application. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={formData.firstName === '' && error ? 'border-red-500' : ''}
        />
        <Input
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={formData.lastName === '' && error ? 'border-red-500' : ''}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={formData.email === '' && error ? 'border-red-500' : ''}
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={formData.phone === '' && error ? 'border-red-500' : ''}
        />
        <Input
          type="url"
          placeholder="Website / Portfolio Link"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
        <DocsUpload setMedia={handleResumeUpload} />
        <TextArea
          label="Tell us about yourself"
          placeholder="Anything you want to share?"
          name="aboutYou"
          value={formData.aboutYou}
          onChange={handleChange}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {/* Toast component for showing success and error messages */}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={closeToast}
      />

      {/* Lottie animation for success */}
      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Lottie className='w-full h-full' animationData={successAnimation} loop={false} />
        </div>
      )}
    </div>
  );
};

export default JobApplicationForm;