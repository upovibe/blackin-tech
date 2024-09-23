import React, { useEffect, useState } from 'react';
import BaseChart from '../common/BaseChart';
import { getAllDocuments } from '../../services/firestoreCRUD'; // Firestore CRUD service
import Lottie from 'lottie-react';
import ChartLoadingAnimation from '../../assets/animations/Animation - ChartLoading.json';
import { FaChartPie } from "react-icons/fa";

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
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      
      try {
        // Fetch all jobs from Firestore
        const jobs = await getAllDocuments('jobs');
        // Fetch all job types from Firestore
        const jobTypes = await getAllDocuments('jobTypes');
        
        const jobTypesCount = {};
        const backgroundColors = {};

        // Initialize jobTypesCount with all job types and assign random colors
        jobTypes.forEach(type => {
          jobTypesCount[type.name] = 0; // Assuming "name" field in jobTypes collection
          backgroundColors[type.name] = generateRandomColor();
        });

        // Count jobs by jobType
        jobs.forEach(job => {
          const type = job.jobType || 'Other';
          if (jobTypesCount[type] !== undefined) {
            jobTypesCount[type]++;
          } else {
            // Count jobs with unspecified job types as "Other"
            jobTypesCount['Other'] = (jobTypesCount['Other'] || 0) + 1;
            backgroundColors['Other'] = backgroundColors['Other'] || generateRandomColor();
          }
        });

        // Set chart data for rendering
        setChartData({
          labels: Object.keys(jobTypesCount),
          datasets: [
            {
              data: Object.values(jobTypesCount),
              backgroundColor: Object.values(backgroundColors),
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }

      setLoading(false); // End loading
    };

    fetchData();
  }, []);

  return (
    <div className="size-full">
    <div className="mb-4">
    <h2 className="text-xl text-black/70 font-semibold flex items-center gap-2"><FaChartPie/>Job Types by Employment Type</h2>        
    <p className="text-sm text-black/70">This Shows user growth and engagement trends.</p>
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
              chartType={chartType}
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
        </div>
      )
    )}
  </div>
  );
};

export default JobTypesChart;
