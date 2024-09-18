import React, { useEffect, useState } from 'react';
import BaseChart from '../common/BaseChart';
import { getAllDocuments } from '../../services/firestoreCRUD';

const ActiveUsersChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllDocuments('users');
      const usersOverTime = {}; // Tracks total users over time

      users.forEach(user => {
        // Assuming user has a Firestore timestamp field like `user.createdAt`
        if (user.createdAt && user.createdAt.toDate) {
          const registrationDate = user.createdAt.toDate(); // Convert Firestore timestamp to JS Date
          const formattedDate = registrationDate.toLocaleDateString(); // Format date as 'MM/DD/YYYY' or similar
          
          // Increment the user count for the registration date
          usersOverTime[formattedDate] = (usersOverTime[formattedDate] || 0) + 1;
        } else {
          console.warn(`Invalid or missing createdAt field for user: ${user.id}`);
        }
      });

      // Sort dates in ascending order and calculate cumulative user count
      const sortedDates = Object.keys(usersOverTime).sort((a, b) => new Date(a) - new Date(b));
      let cumulativeUsers = 0;
      const cumulativeData = sortedDates.map(date => {
        cumulativeUsers += usersOverTime[date];
        return cumulativeUsers;
      });

      // Set the chart data
      setChartData({
        labels: sortedDates,
        datasets: [
          {
            label: 'Total Users Over Time',
            data: cumulativeData,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Total Users Over Time</h2>
      {chartData ? (
        <div className="w-full h-80">
          <BaseChart
            chartType="line"
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ActiveUsersChart;
