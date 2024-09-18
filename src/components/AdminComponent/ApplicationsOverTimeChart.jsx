import React, { useEffect, useState } from 'react';
import BaseChart from '../common/BaseChart';
import { getAllDocuments } from '../../services/firestoreCRUD';

// Function to generate random colors
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ApplicationsOverTimeChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const applications = await getAllDocuments('jobApplications');
      const appsOverTime = {};

      applications.forEach(app => {
        if (app.appliedAt && app.appliedAt.toDate) {
          const submissionDate = app.appliedAt.toDate();
          const formattedDate = submissionDate.toLocaleDateString();
          appsOverTime[formattedDate] = (appsOverTime[formattedDate] || 0) + 1;
        }
      });

      const labels = Object.keys(appsOverTime).sort((a, b) => new Date(a) - new Date(b));
      const data = Object.values(appsOverTime);

      // Generate random colors for each bar
      const backgroundColors = data.map(() => generateRandomColor());

      setChartData({
        labels,
        datasets: [
          {
            label: 'Applications Over Time',
            data,
            backgroundColor: backgroundColors,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Applications Over Time</h2>
      {chartData ? (
        <div className="w-full h-80">
          <BaseChart
            chartType="bar"
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

export default ApplicationsOverTimeChart;
