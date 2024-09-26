// import React, { useEffect, useState } from 'react';
// import { getAllDocuments, updateDocument } from '../services/firestoreCRUD';
// import Button from '../components/common/Button';
// import Toast from '../components/common/Toast';

// const UserBadgeTable = () => {
//   const [users, setUsers] = useState([]);
//   const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

//   useEffect(() => {
//     // Fetch all users when the component mounts
//     const fetchUsersWithBadges = async () => {
//       try {
//         const usersData = await getAllDocuments('users');
//         setUsers(usersData.filter(user => user.badge)); // Only show users with badges
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsersWithBadges();
//   }, []);

//   // Function to remove badge from user
//   const handleRemoveBadge = async (userId) => {
//     try {
//       await updateDocument('users', userId, { badge: null });
//       setToast({ message: 'Badge removed successfully', type: 'success', visible: true });
//       setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, badge: null } : user));
//     } catch (error) {
//       console.error('Error removing badge:', error);
//       setToast({ message: 'Error removing badge', type: 'error', visible: true });
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-4">Manage Assigned Badges</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-slate-300">
//           <thead>
//             <tr className="bg-slate-100">
//               <th className="text-left p-2 border">Avatar</th>
//               <th className="text-left p-2 border">Full Name</th>
//               <th className="text-left p-2 border">Email</th>
//               <th className="text-left p-2 border">Badge</th>
//               <th className="text-center p-2 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map(user => (
//                 <tr key={user.id} className="border-t">
//                   <td className="p-2 border">
//                     <img
//                       src={user.avatarUrl || '/default-avatar.png'}
//                       alt={user.fullName}
//                       className="w-12 h-12 rounded-full"
//                     />
//                   </td>
//                   <td className="p-2 border">{user.fullName}</td>
//                   <td className="p-2 border">{user.email}</td>
//                   <td className="p-2 border">
//                     {user.badge ? (
//                       <div className="flex items-center space-x-2">
//                         <img src={user.badge.logoUrl} alt={user.badge.name} className="w-6 h-6" />
//                         <span>{user.badge.name}</span>
//                       </div>
//                     ) : (
//                       'No badge assigned'
//                     )}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {user.badge ? (
//                       <Button
//                         onClick={() => handleRemoveBadge(user.id)}
//                         className="bg-red-500 text-white px-4 py-2 rounded"
//                       >
//                         Remove Badge
//                       </Button>
//                     ) : (
//                       '—'
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="p-4 text-center text-slate-500">No users with badges assigned</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Toast message for success/error */}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         visible={toast.visible}
//         onClose={() => setToast({ ...toast, visible: false })}
//       />
//     </div>
//   );
// };

// export default UserBadgeTable;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { listenToCollection, updateDocument } from '../services/firestoreCRUD'; 
// import Table from '../components/common/Table';
// import { FaUserTag } from 'react-icons/fa'; 
// import RightSidebar from '../components/common/RightSidebar';
// import Modal from '../components/common/Modal';
// import AssignBadgeForm from '../components/forms/AssignBadgeForm'; // Import AssignBadgeForm
// import Toast from '../components/common/Toast';

// const UserBadgeTable = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = listenToCollection('users', (data) => {
//       setUsers(data.filter(user => user.badge)); // Filter users with badges
//     });
//     return () => unsubscribe();
//   }, []);

//   const columns = [
//     { Header: 'Avatar', accessor: 'avatarUrl', type: 'image' },
//     { Header: 'Full Name', accessor: 'fullName', type: 'text' },
//     { Header: 'Email', accessor: 'email', type: 'text' },
//     {
//       Header: 'Badge',
//       accessor: 'badge',
//       type: 'text',
//       Cell: ({ value }) => (value ? (
//         <div className="flex items-center space-x-2">
//           <img src={value.icon} alt={value.name} className="w-6 h-6" />
//           <span>{value.name}</span>
//         </div>
//       ) : (
//         <span>No badge assigned</span>
//       )),
//     },
//     { Header: 'Action', accessor: 'action', type: 'action' },
//   ];

//   const handleDeleteBadge = async (user) => {
//     try {
//       await updateDocument('users', user.id, { badge: null }); // Remove badge
//       setToast({ message: 'Badge removed successfully', type: 'success', visible: true });
//       setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, badge: null } : u));
//     } catch (error) {
//       console.error('Error removing badge:', error);
//       setToast({ message: 'Error removing badge', type: 'error', visible: true });
//     }
//   };

//   const handleBulkDelete = () => {
//     selectedRows.forEach((rowId) => {
//       const userToUpdate = users.find((user) => user.id === rowId);
//       if (userToUpdate) {
//         handleDeleteBadge(userToUpdate); // Remove badge for each selected user
//       }
//     });

//     setSelectedRows(new Set()); // Clear selected rows after bulk delete
//   };

//   const handleViewUser = (user) => {
//     setSelectedUser(user); 
//     setIsSidebarOpen(true); 
//   };

//   const handleOpenModal = () => {
//     setSelectedUser(null); 
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <>
//        <Table
//         title="User Badges"
//         icon={<FaUserTag />}
//         columns={columns}
//         data={users.map(user => ({
//           ...user,
//           badge: user.badge ? { name: user.badge.name, icon: user.badge.icon } : null, // Ensure you're formatting badge correctly
//         }))}
//         selectedRows={selectedRows}
//         setSelectedRows={setSelectedRows}
//         sortable={true}
//         filterable={true}
//         pagination={true}
//         onDelete={handleDeleteBadge}
//         handleBulkDelete={handleBulkDelete}
//         onView={handleViewUser}
//         onAdd={handleOpenModal}
//         className="w-full text-sm text-gray-700"
//       />

//       {/* RightSidebar Component */}
//       <RightSidebar
//         isOpen={isSidebarOpen}
//         onClose={toggleSidebar}
//         title="User Details"
//       >
//         {selectedUser ? (
//           <div>
//             <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
//             <p><strong>Email:</strong> {selectedUser.email}</p>
//             {selectedUser.badge ? (
//               <div className="flex items-center space-x-2">
//                 <img src={selectedUser.badge.logoUrl} alt={selectedUser.badge.name} className="w-6 h-6" />
//                 <span>{selectedUser.badge.name}</span>
//               </div>
//             ) : (
//               <p>No badge assigned.</p>
//             )}
//           </div>
//         ) : (
//           <p>No user selected.</p>
//         )}
//       </RightSidebar>

//       {/* Modal for assigning badges */}
//       <Modal 
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title="Assign Badge"
//       >
//         <AssignBadgeForm 
//           user={selectedUser} // Pass selected user to AssignBadgeForm
//           onClose={handleCloseModal}
//         />
//       </Modal>

//       {/* Toast message for success/error */}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         visible={toast.visible}
//         onClose={() => setToast({ ...toast, visible: false })}
//       />
//     </>
//   );
// };

// export default UserBadgeTable;
import React, { useEffect, useState } from 'react';
import { getAllDocuments, updateDocument } from '../services/firestoreCRUD';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import Modal from '../components/common/Modal';
import AssignBadgeForm from '../components/forms/AssignBadgeForm'; 
import RightSidebar from '../components/common/RightSidebar'; import { FaEye, FaFilter, } from 'react-icons/fa6';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserBadgeTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);  // Number of users per page
  const [sortColumn, setSortColumn] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [imagePreview, setImagePreview] = useState(null); // For previewing image
  
  useEffect(() => {
    const fetchUsersWithBadges = async () => {
      try {
        const usersData = await getAllDocuments('users');
        setUsers(usersData.filter(user => user.badge));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsersWithBadges();
  }, []);

  const handleRemoveBadge = async (userId) => {
    try {
      await updateDocument('users', userId, { badge: null });
      setToast({ message: 'Badge removed successfully', type: 'success', visible: true });
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error removing badge:', error);
      setToast({ message: 'Error removing badge', type: 'error', visible: true });
    }
  };

  const handleBulkRemove = () => {
    selectedRows.forEach((userId) => {
      handleRemoveBadge(userId);
    });
    setSelectedRows(new Set());
  };

  const handleRowSelect = (userId) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(userId)) {
        newSelectedRows.delete(userId);
      } else {
        newSelectedRows.add(userId);
      }
      return newSelectedRows;
    });
  };

  const handleViewBadge = (user) => {
    setSelectedUser(user);
    setIsSidebarOpen(true);
  };

  const handleEditBadge = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedUser(null);
  };

  const toggleDropdown = (userId) => {
    setIsDropdownOpen(isDropdownOpen === userId ? null : userId);
  };

  const handleImagePreview = (imageUrl) => {
    setImagePreview(imageUrl);
  };

  const filteredUsers = users
    .filter(user => 
      user.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      const columnA = a[sortColumn].toLowerCase();
      const columnB = b[sortColumn].toLowerCase();
      if (sortOrder === 'asc') {
        return columnA < columnB ? -1 : 1;
      } else {
        return columnA > columnB ? -1 : 1;
      }
    });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSortOrder = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Assigned Badges</h1>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Filter by name or email"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <FaFilter className="text-gray-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left p-2 border">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked
                        ? new Set(users.map((user) => user.id))
                        : new Set()
                    )
                  }
                  checked={selectedRows.size === users.length}
                />
              </th>
              <th className="text-left p-2 border" onClick={() => toggleSortOrder('fullName')}>Full Name</th>
              <th className="text-left p-2 border" onClick={() => toggleSortOrder('email')}>Email</th>
              <th className="text-left p-2 border" onClick={() => toggleSortOrder('badge')}>Badge</th>
              <th className="text-center p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(user.id)}
                      onChange={() => handleRowSelect(user.id)}
                    />
                  </td>
                  <td className="p-2 border">{user.fullName}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">
                    {user.badge ? (
                      <div className="flex items-center space-x-2">
                        <img src={user.badge.icon} alt={user.badge.name} className="w-6 h-6" />
                        <span>{user.badge.name}</span>
                      </div>
                    ) : (
                      'No badge assigned'
                    )}
                  </td>
                  <td className="p-2 border text-center relative">
                    <button onClick={() => toggleDropdown(user.id)} className="p-2">
                      <FaEllipsisVertical />
                    </button>

                    {isDropdownOpen === user.id && (
                      <div className="absolute right-0 bg-white shadow-lg border mt-1 rounded z-50">
                        <button
                          className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                          onClick={() => handleViewBadge(user)}
                        >
                          <FaEye className="inline mr-2" /> View
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-yellow-500 hover:bg-gray-100"
                          onClick={() => handleEditBadge(user)}
                        >
                          <FaEdit className="inline mr-2" /> Edit
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                          onClick={() => handleRemoveBadge(user.id)}
                        >
                          <FaTrash className="inline mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for Image Preview */}
      {imagePreview && (
        <Modal onClose={() => setImagePreview(null)}>
          <img src={imagePreview} alt="Avatar Preview" className="max-w-full h-auto" />
        </Modal>
      )}

      {isSidebarOpen && selectedUser && (
        <RightSidebar onClose={handleCloseSidebar}>
          <h2 className="text-xl font-semibold mb-4">{selectedUser.fullName}'s Badge</h2>
          <p>Email: {selectedUser.email}</p>
          <div className="mt-4">
            {selectedUser.badge ? (
              <>
                <img src={selectedUser.badge.icon} alt={selectedUser.badge.name} className="w-12 h-12" />
                <p className="mt-2">{selectedUser.badge.name}</p>
              </>
            ) : (
              <p>No badge assigned</p>
            )}
          </div>
        </RightSidebar>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      <AssignBadgeForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserBadgeTable;


