import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Checkbox from '../common/Checkbox';
import PasswordInput from '../common/PasswordInput';
import { FaArrowLeft, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa6';
import HorizontalLineWithText from '../common/HorizontalLineWithText';


const SignUpForm = () => {
    const [isEmailSignUp, setIsEmailSignUp] = useState(false);

    const [formValues, setFormValues] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        acceptTerms: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEmailSignUpClick = () => {
        setIsEmailSignUp(true);
    };

    const handleBackClick = () => {
        setIsEmailSignUp(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Sign up to BlackIn Tech</h2>

            <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isEmailSignUp ? 'max-h-screen' : 'max-h-0'}`}>
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
                    <div className='w-full flex items-center gap-4'>
                        <Input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formValues.fullName}
                            onChange={handleInputChange}
                        />
                        <Input
                            type="text"
                            name="userName"
                            placeholder="Username"
                            value={formValues.userName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formValues.email}
                        onChange={handleInputChange}
                    />
                    <PasswordInput
                        name="password"
                        placeholder="Password"
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                    <Checkbox
                        label="I accept the Terms and Conditions"
                        checked={formValues.acceptTerms}
                        onChange={handleInputChange}
                        name="acceptTerms"
                    />
                    <Button iconRight={<FaSignInAlt />} type="submit">Sign Up</Button>
                </form>
            </div>

            {!isEmailSignUp && (
                <div className="space-y-4">
                    <div className='w-full flex flex-col justify-center items-center space-y-3'>
                        <Button className='w-full' iconLeft={<FaGoogle />} onClick={() => {/* Handle Google Sign Up */ }}>Sign up with Google</Button>
                        <HorizontalLineWithText text="or" />
                        <Button className='w-full' iconLeft={<FaEnvelope />} onClick={handleEmailSignUpClick}>Continue with email</Button>
                    </div>

                    <p className="mb-4">By creating an account you agree with our Terms of Service, Privacy Policy, and our default Notification Settings.</p>
                </div>
            )}

            <p className="mt-4 text-sm text-slate-600">
                Already have an account? <a href="/sign-in" className="text-blue-500">Sign In</a>
            </p>
        </div>
    );
};

export default SignUpForm;
