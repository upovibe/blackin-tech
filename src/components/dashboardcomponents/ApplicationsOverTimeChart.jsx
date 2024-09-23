import React, { useEffect, useState } from 'react';
import BaseChart from '../common/BaseChart';
import { getAllDocuments } from '../../services/firestoreCRUD';
import Lottie from 'lottie-react';
import ChartLoadingAnimation from '../../assets/animations/Animation - ChartLoading.json'
import { FaChartBar } from "react-icons/fa";

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
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
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
      setLoading(false); // End loading
    };

    fetchData();
  }, []);

  return (
    <div className="size-full">
    <div className="mb-4">
    <h2 className="text-xl text-black/70 font-semibold flex items-center gap-2"><FaChartBar/>Applications Over Time</h2>        
    <p className="text-sm text-black/70">This Shows user growth applications</p>
    </div>
    {loading ? (
      <div className="flex items-center justify-center size-full">
        <Lottie
          animationData={ChartLoadingAnimation}
          loop={true}
          className="w-full h-full"
        />
      </div>
    ) : (
      chartData && (
        <div className="w-full h-ful h-[300px]">
          <BaseChart
            chartType="bar"
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      )
    )}
  </div>
  );
};

export default ApplicationsOverTimeChart;
