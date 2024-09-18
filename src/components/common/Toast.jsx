import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Toast = ({ type = 'success', message, visible, onClose }) => {

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const typeClasses = type === 'success'
    ? 'bg-green-700 border-green-500 text-white shadow-green-500/50'
    : 'bg-red-700 border-red-500 text-white shadow-red-500/50';

  if (!visible) return null;

  return (
    <div
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 max-w-full w-auto z-50 transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div
        className={`toast ${typeClasses} border-2 flex items-center gap-1 sm:gap-4 p-2 rounded-xl shadow-lg`}
      >
        {type === 'success' ? (
          <FaCheckCircle className="text-base sm:text-lg text-green-100" />
        ) : (
          <FaExclamationCircle className="text-base sm:text-lg text-red-100" />
        )}
        <p className="text-xs sm:text-sm">{message}</p>
      </div>
    </div>
  );
};

Toast.propTypes = {
  type: PropTypes.oneOf(['success', 'error']),
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
