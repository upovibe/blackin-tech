import React from "react";
import { FaTimes } from "react-icons/fa";

const RightSidebar = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* RightSidebar */}
      <div
        className={`fixed top-0 right-0 w-screen md:w-[480px] h-full shadow-lg z-50 transform transition-transform duration-300 bg-slate-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 px-6 flex justify-between items-center border-b-2 border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-300"
          >
            <FaTimes className="font-light" />
          </button>
        </div>
        <div className="p-4 text-slate-700">{children}</div>
      </div>
    </>
  );
};

export default RightSidebar;
