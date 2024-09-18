import React, { useEffect, useState } from 'react';
import BaseChart from '../common/BaseChart';
import { getAllDocuments } from '../../services/firestoreCRUD';

const ActiveUsersChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllDocuments('users');
      const activeUsersByDay = {}; // To track active users over time (e.g., daily)

      users.forEach(user => {
        const lastActiveDate = new Date(user.lastActive).toLocaleDateString();
        activeUsersByDay[lastActiveDate] = (activeUsersByDay[lastActiveDate] || 0) + 1;
      });

      const labels = Object.keys(activeUsersByDay);
      const data = Object.values(activeUsersByDay);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Active Users Over Time',
            data,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Active Users Over Time</h2>
      {chartData && (
        <BaseChart
          chartType="line"
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      )}
    </div>
  );
};

export default ActiveUsersChart;
