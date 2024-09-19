import React from 'react';
import StatsDisplay from '../components/AdminComponent/StatsDisplay';
import ActiveUsersChart from '../components/AdminComponent/ActiveUsersChart';
import JobsPostedChart from '../components/AdminComponent/JobPostedChart';
import JobTypesChart from '../components/AdminComponent/JobTypesChart';
import ApplicationsOverTimeChart from '../components/AdminComponent/ApplicationsOverTimeChart';

const Dashboard = () => {
  return (
    <main className='h-screen'>
      <section>
        <div className='p-4'>
          <h1 className="text-2xl font-bold mb-6">Dashboard Content</h1>
          <StatsDisplay />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 ">
            <div className="bg-white rounded-lg p-4 shadow h-64">
              <ActiveUsersChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <JobsPostedChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <JobTypesChart />
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <ApplicationsOverTimeChart />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
