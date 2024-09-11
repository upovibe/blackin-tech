import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { updateProfile } from '../../services/authService';

const CompleteProfile = () => {
    const [formValues, setFormValues] = useState({
        userName: '',
        avatarUrl: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateProfile(formValues);

            if (result.success) {
                navigate('/profile');
            } else {
                // Handle error
            }
        } catch (error) {
            // Handle error
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    name="userName"
                    placeholder="Username"
                    value={formValues.userName}
                    onChange={handleInputChange}
                />
                <Input
                    type="text"
                    name="avatarUrl"
                    placeholder="Avatar URL"
                    value={formValues.avatarUrl}
                    onChange={handleInputChange}
                />
                <Button type="submit">Save</Button>
            </form>
        </div>
    );
};

export default CompleteProfile;
