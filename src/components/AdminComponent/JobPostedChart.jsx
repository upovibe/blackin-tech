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

const JobsPostedChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const jobs = await getAllDocuments('jobs');
      const jobsByDate = {};

      jobs.forEach(job => {
        if (job.createdAt && job.createdAt.toDate) {
          const postDate = job.createdAt.toDate();
          const formattedDate = postDate.toLocaleDateString();
          jobsByDate[formattedDate] = (jobsByDate[formattedDate] || 0) + 1;
        } else {
          console.warn(`Invalid or missing createdAt field for job: ${job.id}`);
        }
      });

      const labels = Object.keys(jobsByDate).sort((a, b) => new Date(a) - new Date(b));
      const data = Object.values(jobsByDate);

      // Generate random colors for each bar
      const backgroundColors = data.map(() => generateRandomColor());

      setChartData({
        labels,
        datasets: [
          {
            label: 'Jobs Posted Over Time',
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
      <h2 className="text-xl font-semibold mb-4">Jobs Posted Over Time</h2>
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

export default JobsPostedChart;
