import React, { useState, useEffect } from 'react';
import JobTable from "../components/tables/JobTable";
import Lottie from "lottie-react";
import LoadingPage from "../assets/animations/Animation - LoadingPage.json";

const JobPortal = () => {
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
      <div className="p-4">
        <JobTable />
      </div>
    </>
  );
};

export default JobPortal;
