import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import UserTable from "../components/tables/UserTable";
import JobTable from "../components/tables/JobTable";
import StatsDisplay from "../components/AdminComponent/StatsDisplay";
import ActiveUsersChart from "../components/AdminComponent/ActiveUsersChart";
import JobsPostedChart from "../components/AdminComponent/JobPostedChart";
import HorizontalLineWithText from "../components/common/HorizontalLineWithText";
import { FaChartSimple, FaGaugeSimple, FaUserTie } from "react-icons/fa6";

const Dashboard = () => {
  const { user } = UserAuth();

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
          <div className="w-full">
            <div className="">            
            <UserTable/>
            {/* <JobTable/> */}
            </div>
          </div>
          <HorizontalLineWithText>
            <span className="text-sm font-semibold flex items-center gap-2">
              <FaGaugeSimple/>statistics
            </span>
          </HorizontalLineWithText>
          <StatsDisplay />
          <HorizontalLineWithText>
            <span className="text-sm font-semibold flex items-center gap-2">
              <FaChartSimple />
              Charts
            </span>
          </HorizontalLineWithText>
          {/* Ensure that both charts have equal space allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <ActiveUsersChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <JobsPostedChart />
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
