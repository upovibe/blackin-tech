import React, { useEffect, useState } from "react";
import BaseChart from "../common/BaseChart";
import { getAllDocuments } from "../../services/firestoreCRUD";
import Lottie from "lottie-react";
import ChartLoadingAnimation from "../../assets/animations/Animation - ChartLoading.json";
import { FaChartBar } from "react-icons/fa";

// Function to generate random colors
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const JobsPostedChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      const jobs = await getAllDocuments("jobs");
      const jobsByDate = {};

      jobs.forEach((job) => {
        if (job.createdAt && job.createdAt.toDate) {
          const postDate = job.createdAt.toDate();
          const formattedDate = postDate.toLocaleDateString();
          jobsByDate[formattedDate] = (jobsByDate[formattedDate] || 0) + 1;
        } else {
          console.warn(`Invalid or missing createdAt field for job: ${job.id}`);
        }
      });

      const labels = Object.keys(jobsByDate).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const data = Object.values(jobsByDate);

      // Generate random colors for each bar
      const backgroundColors = data.map(() => generateRandomColor());

      setChartData({
        labels,
        datasets: [
          {
            label: "Jobs Posted Over Time",
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
    <div className="">
      <div className="mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2"><FaChartBar/>Jobs Posted Over Time</h2>        
      <p className="text-sm text-black/70">The shows the total number of Jobs posted on the platform overtime</p>
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
          <div className="size-full h-[300px]">
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

export default JobsPostedChart;
