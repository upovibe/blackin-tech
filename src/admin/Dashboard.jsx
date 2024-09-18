import React from 'react';
import StatsDisplay from '../components/AdminComponent/StatsDisplay';
import ActiveUsersChart from '../components/AdminComponent/ActiveUsersChart';
import JobsPostedChart from '../components/AdminComponent/JobPostedChart';
import JobTypesChart from '../components/AdminComponent/JobTypesChart';
import ApplicationsOverTimeChart from '../components/AdminComponent/ApplicationsOverTimeChart';

const Dashboard = () => {
  return (
    <div>
        <StatsDisplay />
        <div className="">
        <ActiveUsersChart />
        <JobsPostedChart />
        <JobTypesChart/>
        <ApplicationsOverTimeChart />
        </div>
    </div>
  );
};

export default Dashboard;
