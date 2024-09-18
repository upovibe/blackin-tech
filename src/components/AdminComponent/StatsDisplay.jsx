import React, { useState, useEffect } from 'react';
import { getAllDocuments, listenToCollection } from '../../services/firestoreCRUD';

const StatsDisplay = () => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRegistrations, setNewRegistrations] = useState(0);
  const [totalSavedJobs, setTotalSavedJobs] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total jobs
        const jobs = await getAllDocuments('jobs');
        setTotalJobs(jobs.length);

        // Fetch total applications
        const applications = await getAllDocuments('jobApplications');
        setTotalApplications(applications.length);

        // Fetch total users
        const users = await getAllDocuments('users');
        setTotalUsers(users.length);

        // Calculate active users (those currently online)
        const activeUsersCount = users.filter(user => user.isOnline).length;
        setActiveUsers(activeUsersCount);

        // Calculate new registrations (within the last 30 days)
        const today = new Date();
        const newRegistrationsCount = users.filter(user => {
          const registrationDate = new Date(user.registrationDate);
          return (today - registrationDate) / (1000 * 60 * 60 * 24) <= 30; // Last 30 days
        }).length;
        setNewRegistrations(newRegistrationsCount);

        // Fetch saved jobs and calculate total saved jobs
        const savedJobs = await getAllDocuments('savedJobs');
        let totalSaves = 0;
        savedJobs.forEach(doc => {
          totalSaves += Array.isArray(doc.jobs) ? doc.jobs.length : 0;
        });
        setTotalSavedJobs(totalSaves);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();

    // Set up real-time listeners
    const unsubscribeJobs = listenToCollection('jobs', (data) => setTotalJobs(data.length));
    const unsubscribeApplications = listenToCollection('jobApplications', (data) => setTotalApplications(data.length));
    const unsubscribeUsers = listenToCollection('users', (data) => {
      setTotalUsers(data.length);
      const activeUsersCount = data.filter(user => user.isOnline).length;
      setActiveUsers(activeUsersCount);
      const today = new Date();
      const newRegistrationsCount = data.filter(user => {
        const registrationDate = new Date(user.registrationDate);
        return (today - registrationDate) / (1000 * 60 * 60 * 24) <= 30; // Last 30 days
      }).length;
      setNewRegistrations(newRegistrationsCount);
    });

    const unsubscribeSavedJobs = listenToCollection('savedJobs', (data) => {
      let totalSaves = 0;
      data.forEach(doc => {
        totalSaves += Array.isArray(doc.jobs) ? doc.jobs.length : 0;
      });
      setTotalSavedJobs(totalSaves);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeApplications();
      unsubscribeUsers();
      unsubscribeSavedJobs();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-slate-100">
      <div className="p-4 bg-slate-200 rounded shadow">
        <h2 className="text-lg font-bold">Total Jobs Posted</h2>
        <p className="text-3xl">{totalJobs}</p>
      </div>
      <div className="p-4 bg-slate-200 rounded shadow">
        <h2 className="text-lg font-bold">Total Applications</h2>
        <p className="text-3xl">{totalApplications}</p>
      </div>
      <div className="p-4 bg-slate-200 rounded shadow">
        <h2 className="text-lg font-bold">Active Users</h2>
        <p className="text-3xl">{activeUsers}</p>
      </div>
      <div className="p-4 bg-slate-200 rounded shadow">
        <h2 className="text-lg font-bold">Total Registered Users</h2>
        <p className="text-3xl">{totalUsers}</p>
      </div>
      <div className="p-4 bg-slate-200 rounded shadow">
        <h2 className="text-lg font-bold">New Registrations</h2>
        <p className="text-3xl">{newRegistrations}</p>
      </div>
      <div className="p-4 bg-slate-200 rounded shadow">
        <h2 className="text-lg font-bold">Total Saved Jobs</h2>
        <p className="text-3xl">{totalSavedJobs}</p>
      </div>
    </div>
  );
};

export default StatsDisplay;
