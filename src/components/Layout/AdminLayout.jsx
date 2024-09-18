import React from 'react';
import Sidebar from '../AdminComponent/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
