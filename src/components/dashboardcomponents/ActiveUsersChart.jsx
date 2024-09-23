import React, { useEffect, useState } from "react";
import BaseChart from "../common/BaseChart";
import { getAllDocuments } from "../../services/firestoreCRUD";
import Lottie from "lottie-react";
import ChartLoadingAnimation from "../../assets/animations/Animation - ChartLoading.json";
import { FaChartLine } from "react-icons/fa";

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
    <div className="size-full">
      <div className="mb-4">
      <h2 className="text-xl text-black/70 font-semibold flex items-center gap-2"><FaChartLine/>Total Users Over Time</h2>        
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
              chartType="line"
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

export default ActiveUsersChart;
