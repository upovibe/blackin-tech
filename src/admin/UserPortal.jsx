import React, { useState, useEffect } from 'react';
import UserTable from "../components/tables/UserTable";
import Lottie from "lottie-react";
import LoadingPage from "../assets/animations/Animation - LoadingPage.json";

const UserPortal = () => {
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
    <main className='h-screen overflow-auto pb-28'>
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Users Table</h1>
        <UserTable />
      </div>
    </main>
  );
};

export default UserPortal;
