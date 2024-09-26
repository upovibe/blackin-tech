import React from 'react';

const Dialog = ({ isOpen, title, message, onCancel, onConfirm }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-start justify-center ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div
        className={`bg-white w-full max-w-md mx-auto mt-20 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <p className="text-slate-600 mt-4">{message}</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
