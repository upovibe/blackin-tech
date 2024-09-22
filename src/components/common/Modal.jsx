import React from "react";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        onClick={(e) => e.stopPropagation()} // Prevent click events inside modal from closing it
        className="relative w-screen h-screen md:w-5/6 lg:w-4/6 xl:w-3/6 md:h-5/6 p-3 md:p-4 bg-white rounded-lg shadow-lg transition-transform transform scale-100 flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto py-5">
          {children} {/* Dynamic content passed as children */}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end py-2 border-t-2">
          <Button
          type="button"          
            onClick={onClose}
            className="px-4 py-2 text-white bg-slate-800 rounded hover:bg-slate-900"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
