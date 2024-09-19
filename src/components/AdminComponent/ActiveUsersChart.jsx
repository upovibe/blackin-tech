import React, { useEffect, useState } from "react";
import BaseChart from "../common/BaseChart";
import { getAllDocuments } from "../../services/firestoreCRUD";
import Lottie from "lottie-react";
import ChartLoadingAnimation from "../../assets/animations/Animation - ChartLoading.json";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ActiveUsersChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      const users = await getAllDocuments("users");
      const usersOverTime = {}; 

      users.forEach((user) => {
        if (user.createdAt && user.createdAt.toDate) {
          const registrationDate = user.createdAt.toDate();
          const formattedDate = registrationDate.toLocaleDateString();
          usersOverTime[formattedDate] =
            (usersOverTime[formattedDate] || 0) + 1;
        } else {
          console.warn(
            `Invalid or missing createdAt field for user: ${user.id}`
          );
        }
      });

      const sortedDates = Object.keys(usersOverTime).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      let cumulativeUsers = 0;
      const cumulativeData = sortedDates.map((date) => {
        cumulativeUsers += usersOverTime[date];
        return cumulativeUsers;
      });

      const backgroundColors = sortedDates.map(() => generateRandomColor());

      setChartData({
        labels: sortedDates,
        datasets: [
          {
            label: "Total Users Over Time",
            data: cumulativeData,
            borderColor: backgroundColors,
            backgroundColor: backgroundColors,
            fill: false,
            borderWidth: 2,
            pointRadius: 4,
          },
        ],
      });
      setLoading(false); // End loading
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Total Users Over Time</h2>
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
          <div className="size-full">
            <BaseChart
              chartType="line"
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ActiveUsersChart;
