import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

// Updated TopModal.jsx with backdrop click
const AlertBanner = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (event) => {
          if (event.key === "Escape") {
            onClose();
          }
        };
        if (isOpen) {
          document.addEventListener("keydown", handleEsc);
        } else {
          document.removeEventListener("keydown", handleEsc);
        }
    
        return () => {
          document.removeEventListener("keydown", handleEsc);
        };
      }, [isOpen, onClose]);
    
      if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-6  bg-black bg-opacity-50"
        aria-modal="true"
        role="dialog"
        aria-labelledby="top-modal-title"
        onClick={onClose} 
      >
        <div
          className={`bg-white rounded-lg shadow-lg w-full max-w-md transform transition-transform ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            {title && (
              <h3 id="top-modal-title" className="text-lg font-semibold">
                {title}
              </h3>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close Modal"
            >
              <FaTimes size={20} />
            </button>
          </div>
  
          {/* Modal Content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );
  };
  

export default AlertBanner;
