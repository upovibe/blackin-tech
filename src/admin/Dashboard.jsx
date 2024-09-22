import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import UserTable from "../components/tables/UserTable";
import JobTable from "../components/tables/JobTable";
import StatsDisplay from "../components/AdminComponent/StatsDisplay";
import ActiveUsersChart from "../components/AdminComponent/ActiveUsersChart";
import JobsPostedChart from "../components/AdminComponent/JobPostedChart";
import HorizontalLineWithText from "../components/common/HorizontalLineWithText";
import RightSidebar from "../components/common/RightSidebar";  // Import RightSidebar
import { FaChartSimple, FaGaugeSimple, FaUserTie } from "react-icons/fa6";
import Lottie from 'lottie-react';
import LoadingPage from '../assets/animations/Animation - LoadingPage.json';
import { FaTable } from "react-icons/fa";

const Dashboard = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={LoadingPage} loop className="w-48 h-48" />
      </div>
    );
  }

  return (
    <main className="h-screen overflow-auto pb-20">
      <section>
        <div className="p-4 flex flex-col gap-5">
          <h1 className="text-2xl font-bold ">Dashboard Content</h1>
          <div className="flex items-ceneter justify-between p-2 bg-slate-300 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Welcome, {user.userName}!</h2>
            <Link
              className="flex items-center gap-2 font-semibold text-sm hover:text-blue-900 hover:underline"
              to="/profile"
            >
              <FaUserTie />
              <span className="hidden md:inline-block">
                You are an {user.role}
              </span>
            </Link>
          </div>

          {/* Sidebar Button */}
          <button 
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleOpenSidebar}
          >
            Open Sidebar
          </button>

          <HorizontalLineWithText>
            <span className="text-sm font-semibold flex items-center gap-2">
              <FaGaugeSimple /> statistics
            </span>
          </HorizontalLineWithText>
          <StatsDisplay />
          <HorizontalLineWithText>
            <span className="text-sm font-semibold flex items-center gap-2">
              <FaChartSimple />
              Charts
            </span>
          </HorizontalLineWithText>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <ActiveUsersChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <JobsPostedChart />
            </div>
          </div>
          <HorizontalLineWithText>
            <span className="text-sm font-semibold flex items-center gap-2">
              <FaTable/>
              Table Management
            </span>
          </HorizontalLineWithText>
          <div className="w-full flex items-center gap-6">
            <div className="w-1/2">
              <UserTable />
            </div>
            <div className="w-1/2">
              <JobTable />
            </div>
          </div>
        </div>
      </section>

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title="Sidebar Title"
      >
        <p>Content inside the sidebar</p>
      </RightSidebar>
    </main>
  );
};

export default Dashboard;
