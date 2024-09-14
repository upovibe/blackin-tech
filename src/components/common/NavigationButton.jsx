import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
      >
        Back
      </button>
      <button
        onClick={() => navigate(1)} // Go forward to the next page in history
        className="mb-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default NavigationButtons;
