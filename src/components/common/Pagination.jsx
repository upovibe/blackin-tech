import React from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination flex items-center justify-center space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-button p-2 rounded-full border-2 border-gray-300 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
      >
        <FaChevronLeft />
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-button p-2 rounded-full border-2 border-gray-300 hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;