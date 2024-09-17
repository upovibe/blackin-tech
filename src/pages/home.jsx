import React from 'react';
import Hero from '../components/common/Hero';
import { FaUserFriends, FaBriefcase, FaRocket } from 'react-icons/fa';

function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50">
      {/* Background Gradient Circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-10">
          <div className="w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 opacity-10">
          <div className="w-72 h-72 bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="flex items-center justify-center py-16 relative z-10">
        <div className="container">
          <Hero />
        </div>
      </section>
    </main>
  );
}

export default Home;
