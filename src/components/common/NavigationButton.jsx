import React from 'react';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons flex items-center justify-between px-3">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-4 bg-gray-300 text-gray-700 p-1 px-2 group hover:gap-3 rounded-lg hover:bg-gray-400 flex items-center gap-2 transition-all duration-300 ease-in-out"
      ><FaArrowAltCircleLeft/>
        Back
      </button>
      <button
        onClick={() => navigate(1)} // Go forward to the next page in history
        className="mb-4 bg-gray-300 text-gray-700 p-1 px-2 group hover:gap-3 rounded-lg hover:bg-gray-400 flex flex-row-reverse items-center gap-2 transition-all duration-300 ease-in-out"
      ><FaArrowAltCircleRight />
        Next
      </button>
    </div>
  );
};

export default NavigationButtons;
