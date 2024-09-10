import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <div className="content mt-[4rem] h-[calc(100vh-4rem)]">
        {children}
      </div>
      <Footer/>
    </div>
  );
}

export default MainLayout;