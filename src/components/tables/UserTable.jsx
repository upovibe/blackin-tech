import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD';
import Table from '../common/Table';
import { FaUser } from 'react-icons/fa'; // Change the icon as needed
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('users', (data) => {
      setUsers(data);
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    {
      Header: 'Avatar',
      accessor: 'avatarUrl',
      type: 'image',
      Cell: ({ value }) => (
        <div>
          <img
            src={value || 'https://via.placeholder.com/50'}
            alt="Avatar"
          />
        </div>
      ),
    },
    { Header: 'Full Name', accessor: 'fullName', type: 'text' },
    { Header: 'Username', accessor: 'userName', type: 'text' },
    { Header: 'Email', accessor: 'email', type: 'text' },
    { Header: 'Country', accessor: 'country', type: 'text' },
    { Header: 'Role', accessor: 'role', type: 'text' },
  ];

  const handleUpdate = (user, updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    updateDocument('users', updatedUser.uid, updatedUser)
      .then(() => console.log('User updated successfully'))
      .catch((error) => console.error('Error updating user:', error));
  };

  const handleDelete = (user) => {
    deleteDocument('users', user.uid)
      .then(() => console.log('User deleted successfully'))
      .catch((error) => console.error('Error deleting user:', error));
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsSidebarOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Table
        title="User Table"
        icon={<FaUser />} // Change the icon if desired
        columns={columns}
        data={users}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        onView={handleViewUser}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="User Details"
      >
        {selectedUser ? (
          <div>
            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Username:</strong> {selectedUser.userName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>City:</strong> {selectedUser.city}</p>
            <p><strong>Country:</strong> {selectedUser.country}</p>
            <p><strong>Pronouns:</strong> {selectedUser.pronouns}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
          </div>
        ) : (
          <p>No user selected.</p>
        )}
      </RightSidebar>
    </>
  );
};

export default UserTable;
