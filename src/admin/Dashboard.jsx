import React from 'react';
import StatsDisplay from '../components/AdminComponent/StatsDisplay';
import ActiveUsersChart from '../components/AdminComponent/ActiveUsersChart';

const Dashboard = () => {
  return (
    <div>
        <StatsDisplay />
        <div className="charts-container">
        <ActiveUsersChart />
        </div>
    </div>
  );
};

export default Dashboard;
