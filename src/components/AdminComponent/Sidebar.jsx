import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-slate-800 text-white w-64 h-screen fixed lg:relative lg:h-auto lg:flex lg:flex-col p-4">
      <h2 className="text-center text-xl font-bold mb-6">Dashboard</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="block p-2 rounded hover:bg-slate-700">Overview</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/jobs" className="block p-2 rounded hover:bg-slate-700">Jobs</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/applications" className="block p-2 rounded hover:bg-slate-700">Applications</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/users" className="block p-2 rounded hover:bg-slate-700">Users</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/settings" className="block p-2 rounded hover:bg-slate-700">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
