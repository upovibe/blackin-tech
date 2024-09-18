import React, { useEffect, useState } from 'react';
import BaseChart from '../common/BaseChart';
import { getAllDocuments } from '../../services/firestoreCRUD';
import { fetchJobTypes } from '../../api/jobsApi';

// Function to generate random colors
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const JobTypesChart = ({ chartType = 'pie' }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const jobs = await getAllDocuments('jobs');
      const jobTypesList = await fetchJobTypes();
      const jobTypesCount = {};
      const backgroundColors = {};

      // Initialize jobTypesCount with all job types and assign random colors
      jobTypesList.forEach(type => {
        jobTypesCount[type] = 0;
        backgroundColors[type] = generateRandomColor();
      });

      // Count jobs by type
      jobs.forEach(job => {
        const type = job.jobType || 'Other';
        if (jobTypesCount[type] !== undefined) {
          jobTypesCount[type]++;
        } else {
          jobTypesCount['Other'] = (jobTypesCount['Other'] || 0) + 1;
          backgroundColors['Other'] = backgroundColors['Other'] || generateRandomColor();
        }
      });

      setChartData({
        labels: Object.keys(jobTypesCount),
        datasets: [
          {
            data: Object.values(jobTypesCount),
            backgroundColor: Object.values(backgroundColors),
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Job Types by Employment Type</h2>
      {chartData ? (
        <div className="w-full h-80">
          <BaseChart
            chartType={chartType}
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

export default JobTypesChart;
