import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Logo from "../common/Logo"
import Button from "../common/Button";
import Checkbox from "../common/Checkbox";
import PasswordInput from "../common/PasswordInput";
import { FaArrowLeft, FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import HorizontalLineWithText from "../common/HorizontalLineWithText";
import Toast from "../common/Toast";
import Loader from "../common/Loader";
import { signUpUser, signInWithGoogle } from "../../services/authService";

const SignUpForm = () => {
  const [isEmailSignUp, setIsEmailSignUp] = useState(false);
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "", visible: false });
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEmailSignUpClick = () => {
    setIsEmailSignUp(true);
  };

  const handleBackClick = () => {
    setIsEmailSignUp(false);
  };

  const handleCloseToast = () => {
    setToast((prevToast) => ({ ...prevToast, visible: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!formValues.email || !formValues.password) {
      setToast({
        type: "error",
        message: "Please fill out all required fields.",
        visible: true,
      });
      return;
    }

    if (!formValues.acceptTerms) {
      setToast({
        type: "error",
        message: "You must accept the terms and conditions.",
        visible: true,
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signUpUser(formValues.email, formValues.password, {
        fullName: formValues.fullName,
      });

      if (result.success) {
        navigate("/CompleteProfile");

        setToast({
          type: "success",
          message: "Sign-up successful!",
          visible: true,
        });
      } else {
        setToast({
          type: "error",
          message: result.message || "Sign-up failed",
          visible: true,
        });
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "An error occurred during sign-up.",
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const result = await signInWithGoogle(navigate);

    if (result.success) {
      setToast({
        type: "success",
        message: "Google sign-in successful!",
        visible: true,
      });
    } else {
      setToast({
        type: "error",
        message: result.message || "Google sign-in failed",
        visible: true,
      });
    }
    setLoading(false);
  };

  return (
    <div
      className={`relative p-4 transition-opacity duration-700 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Loader Overlay */}
      {loading && <Loader visible={loading} />}

      <div className="flex items-center justify-center mb-8 md:hidden ">
        <Logo />
      </div>

      <h2 className="text-lg font-bold mb-4 text-center">
        Sign up to BlackIn Tech
      </h2>

      {/* Form content */}
      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden ${
          isEmailSignUp ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
        }`}
      >
        {isEmailSignUp && (
          <button
            type="button"
            onClick={handleBackClick}
            className="mb-4 text-blue-500 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formValues.fullName}
            onChange={handleInputChange}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formValues.email}
            onChange={handleInputChange}
          />
          <PasswordInput
            name="password"
            placeholder="Enter at least six characters"
            value={formValues.password}
            onChange={handleInputChange}
          />
          <div className="flex items-start">
            <Checkbox
              checked={formValues.acceptTerms}
              onChange={handleInputChange}
              name="acceptTerms"
            />
            <p className="mb-4 text-left font-semibold text-xs">
              I agree with BlackIn Tech{" "}
              <Link to="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </Link>
              , and{" "}
              <Link to="/terms" className="text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          <Button className="w-full" iconRight={<FaSignInAlt />} type="submit">
            Sign Up
          </Button>
        </form>
      </div>

      {/* Google sign-up button */}
      {!isEmailSignUp && (
        <div
          className={`transition-opacity duration-700 ${
            isEmailSignUp ? "opacity-0" : "opacity-100"
          } space-y-9`}
        >
          <div className="w-full flex flex-col justify-center items-center space-y-3">
            <Button
              className="w-full text-sm h-10"
              iconLeft={<FaGoogle />}
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>
            <HorizontalLineWithText>
            <span>Or</span>
          </HorizontalLineWithText>
            <Button
              className="w-full text-sm h-10"
              iconLeft={<FaEnvelope />}
              onClick={handleEmailSignUpClick}
            >
              Continue with email
            </Button>
          </div>
          <p className="mb-4 text-center font-semibold text-xs">
            By creating an account you agree with our{" "}
            <Link to="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </Link>
            , and{" "}
            <Link to="/terms" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-500">
          Sign In
        </Link>
      </p>

      {/* Toast component */}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default SignUpForm;
