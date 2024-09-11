import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header className=' bg-slate-100'/>
      <div className="content">
        {children}
      </div>
      <Footer/>
    </div>
  );
}

export default MainLayout;