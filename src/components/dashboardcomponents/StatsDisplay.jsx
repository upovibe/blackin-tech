import React, { useState, useEffect } from "react";
import { getAllDocuments } from "../../services/firestoreCRUD";
import {
  FaBriefcase,
  FaFileAlt,
  FaUsers,
  FaUserPlus,
  FaSave,
  FaUserCheck,
  FaChartLine,
} from "react-icons/fa"; // Icons from react-icons

const StatsDisplay = () => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRegistrations, setNewRegistrations] = useState(0);
  const [totalSavedJobs, setTotalSavedJobs] = useState(0);
  const [jobsWithNoApplications, setJobsWithNoApplications] = useState(0);
  const [jobTypesCount, setJobTypesCount] = useState(0);

  // Function to generate random colors
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await getAllDocuments("jobs");
        setTotalJobs(jobs.length);

        const applications = await getAllDocuments("jobApplications");
        setTotalApplications(applications.length);

        const users = await getAllDocuments("users");
        setTotalUsers(users.length);

        // Calculate active users based on activities
        const userActivities = await getAllDocuments("userActivities"); // Assume you have a userActivities collection
        const activeUserIds = new Set();

        users.forEach((user) => {
          const userActivity = userActivities.find((activity) => activity.userId === user.id);
          const today = new Date();
          const activityThreshold = 30; // Active if they did something in the last 30 days

          if (userActivity) {
            const lastActiveDate = new Date(userActivity.lastActive); // Assume lastActive field exists
            const daysActive = (today - lastActiveDate) / (1000 * 60 * 60 * 24);
            
            if (daysActive <= activityThreshold || userActivity.savedJobs.length > 0 || userActivity.postedJobs.length > 0) {
              activeUserIds.add(user.id);
            }
          }
        });

        setActiveUsers(activeUserIds.size);

        const newRegistrationsCount = users.filter((user) => {
          const registrationDate = new Date(user.registrationDate);
          const today = new Date();
          return (today - registrationDate) / (1000 * 60 * 60 * 24) <= 30;
        }).length;
        setNewRegistrations(newRegistrationsCount);

        const savedJobs = await getAllDocuments("savedJobs");
        let totalSaves = 0;
        savedJobs.forEach((doc) => {
          totalSaves += Array.isArray(doc.jobs) ? doc.jobs.length : 0;
        });
        setTotalSavedJobs(totalSaves);

        const jobTypes = await getAllDocuments("jobTypes");
        setJobTypesCount(jobTypes.length);

        const jobsWithNoAppsCount = jobs.filter((job) => {
          const jobApps = applications.filter((app) => app.jobId === job.id);
          return jobApps.length === 0;
        }).length;
        setJobsWithNoApplications(jobsWithNoAppsCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Jobs Posted",
      value: totalJobs,
      icon: <FaBriefcase />,
      color: generateRandomColor(),
    },
    {
      title: "Total Applications",
      value: totalApplications,
      icon: <FaFileAlt />,
      color: generateRandomColor(),
    },
    {
      title: "Total Job Types",
      value: jobTypesCount,
      icon: <FaChartLine />,
      color: generateRandomColor(),
    },
    {
      title: "Jobs with No Applications",
      value: jobsWithNoApplications,
      icon: <FaFileAlt />,
      color: generateRandomColor(),
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: <FaUsers />,
      color: generateRandomColor(),
    },
    {
      title: "Total Registered Users",
      value: totalUsers,
      icon: <FaUserCheck />,
      color: generateRandomColor(),
    },
    {
      title: "New Registrations",
      value: newRegistrations,
      icon: <FaUserPlus />,
      color: generateRandomColor(),
    },
    {
      title: "Total Saved Jobs",
      value: totalSavedJobs,
      icon: <FaSave />,
      color: generateRandomColor(),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-100">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 bg-slate-200 rounded shadow border-l-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-300`}
          style={{ borderColor: stat.color }}
        >
          <h2 className="text-lg font-bold mb-3">{stat.title}</h2>
          <div className="flex items-center justify-between space-x-4">
            <div className="text-3xl" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-semibold text-white bg-slate-600 flex items-center justify-center size-10 min-h-10 min-w-10 rounded-full ">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;
