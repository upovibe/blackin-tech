import React from 'react';

const HorizontalLineWithText = ({ htmlText = 'Or', className = '' }) => (
  <div className={`flex items-center justify-center w-full ${className}`}>
    <hr className="flex-1 border-t border-gray-400 mx-2" />
    <span
      className="px-2 text-gray-700"
      dangerouslySetInnerHTML={{ __html: htmlText }}
    />
    <hr className="flex-1 border-t border-gray-400 mx-2" />
  </div>
);

export default HorizontalLineWithText;
