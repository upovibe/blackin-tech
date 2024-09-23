import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import LoadingPage from "../assets/animations/Animation - LoadingPage.json";
import ActiveUsersChart from "../components/dashboardcomponents/ActiveUsersChart";
import JobsPostedChart from "../components/dashboardcomponents/JobPostedChart"; 
import ApplicationsOverTimeChart from "../components/dashboardcomponents/ApplicationsOverTimeChart"; 
import JobTypesChart from "../components/dashboardcomponents/JobTypesChart"; 

const StartReports = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={LoadingPage} loop className="w-48 h-48" />
      </div>
    );
  }
  return (
    <>
      <main className="h-screen overflow-auto pb-20">
        <section className=" p-4">
        <h1 className="text-2xl font-bold mb-6">Chart Reports</h1>
          <div className="size-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">                
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <ActiveUsersChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <JobsPostedChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <ApplicationsOverTimeChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow w-full">
              <JobTypesChart />
            </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default StartReports;
