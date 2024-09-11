import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import PasswordInput from '../common/PasswordInput';
import { FaGoogle, FaSignInAlt } from 'react-icons/fa';
import HorizontalLineWithText from '../common/HorizontalLineWithText';
import Toast from '../common/Toast';
import Loader from '../common/Loader';
import { signInUser, signInWithGoogle } from '../../services/authService';

const SignInForm = () => {
  const [formValues, setFormValues] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '', visible: false });
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseToast = () => {
    setToast((prevToast) => ({ ...prevToast, visible: false }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.identifier || !formValues.password) {
        setToast({ type: 'error', message: 'Please fill out all required fields.', visible: true });
        return;
    }

    setLoading(true);

    try {
        const result = await signInUser(formValues.identifier, formValues.password);

        if (result.success) {
            if (formValues.identifier === 'admin@example.com') {
                // Navigate admin to admin dashboard
                navigate('/admin/dashboard');
            } else {
                // Navigate regular users to their profile
                navigate('/profile');
            }

            setToast({ type: 'success', message: 'Sign-in successful!', visible: true });
        } else {
            setToast({ type: 'error', message: result.message || 'Sign-in failed', visible: true });
        }

        setLoading(false);
    } catch (error) {
        setToast({ type: 'error', message: 'An error occurred during sign-in.', visible: true });
        setLoading(false);
    }
};


  const handleGoogleSignIn  = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      setToast({ type: 'success', message: 'Google sign-in successful!', visible: true });
      setTimeout(() => {
        setLoading(false);
        navigate('/profile');
      }, 2000);
    } else {
      setToast({ type: 'error', message: result.message || 'Google sign-in failed', visible: true });
      setLoading(false);
    }
  };

  return (
    <div className={`relative p-4 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Loader Overlay */}
      {loading && <Loader visible={loading} />}

      <h2 className="text-lg font-bold mb-4 text-center">Sign in to BlackIn Tech</h2>

      {/* Form content */}
      <div className="transition-all duration-700 ease-in-out overflow-hidden opacity-100 max-h-screen">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button type="button"  className="w-full text-sm h-10" iconLeft={<FaGoogle />} onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
          <HorizontalLineWithText text="or" />
          <Input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            value={formValues.identifier}
            onChange={handleInputChange}
          />
          <PasswordInput
            name="password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={handleInputChange}
          />
          <Button className="w-full" iconRight={<FaSignInAlt />} type="submit">
            Sign In
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Toast component */}
      <Toast type={toast.type} message={toast.message} visible={toast.visible} onClose={handleCloseToast} />
    </div>
  );
};

export default SignInForm;