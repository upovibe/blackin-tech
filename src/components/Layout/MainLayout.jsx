import React from 'react';
import Header from './Header';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <div className="main-layout flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50">
      <Header className="" />
      <div className="flex-grow">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-10">
          <div className="w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 opacity-10">
          <div className="w-72 h-72 bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
        </div>
      </div>
        {children}
      </div>
      <Footer className=''/>
    </div>
  );
}

export default MainLayout;
