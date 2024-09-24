// import React, { useState, useEffect } from 'react';
// import { updateDocument, listenToCollection } from '../services/firestoreCRUD';
// import Modal from '../components/common/Modal';
// import Button from '../components/common/Button';
// import Toast from '../components/common/Toast';

// const AssignBadge = () => {
//   const [users, setUsers] = useState([]);
//   const [badges, setBadges] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedBadge, setSelectedBadge] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

//   // Real-time listener for users and badges
//   useEffect(() => {
//     const unsubscribeUsers = listenToCollection('users', (data) => {
//       setUsers(data);
//     });

//     const unsubscribeBadges = listenToCollection('badges', (data) => {
//       setBadges(data);
//     });

//     // Cleanup listeners on component unmount
//     return () => {
//       unsubscribeUsers();
//       unsubscribeBadges();
//     };
//   }, []);

//   const openModal = (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   const handleAssignBadge = async () => {
//     if (!selectedBadge) {
//       alert('Please select a badge.');
//       return;
//     }

//     try {
//       // Update user's document with the selected badge object
//       await updateDocument('users', selectedUser.id, { badge: selectedBadge });
//       setToast({
//         message: `Badge "${selectedBadge.name}" assigned to ${selectedUser.fullName}`,
//         type: 'success',
//         visible: true,
//       });
//       setIsModalOpen(false);
//       setSelectedBadge(null); // Clear badge selection
//     } catch (error) {
//       console.error('Error assigning badge:', error);
//       setToast({
//         message: 'Error assigning badge.',
//         type: 'error',
//         visible: true,
//       });
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Assign Badge to User</h1>

//       {/* Table to list users */}
//       <table className="table-auto w-full text-left">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="px-4 py-2">Full Name</th>
//             <th className="px-4 py-2">Email</th>
//             <th className="px-4 py-2">Badge</th>
//             <th className="px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id} className="border-b">
//               <td className="px-4 py-2">{user.fullName}</td>
//               <td className="px-4 py-2">{user.email}</td>
//               <td className="px-4 py-2">{user.badge ? user.badge.name : 'None'}</td>
//               <td className="px-4 py-2">
//                 <Button onClick={() => openModal(user)} className="bg-blue-500 text-white">
//                   Assign Badge
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal to assign badge */}
//       {isModalOpen && (
//         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Badge">
//           <div className="mb-4">
//             <p><strong>User:</strong> {selectedUser.fullName}</p>
//           </div>
//           <div className="mb-4">
//             <label htmlFor="badge" className="block text-gray-700">Select Badge</label>
//             <select
//               id="badge"
//               className="w-full mt-2 p-2 border"
//               value={selectedBadge ? selectedBadge.name : ''}
//               onChange={(e) => {
//                 const badge = badges.find(b => b.name === e.target.value);
//                 setSelectedBadge(badge); // Set the full badge object
//               }}
//             >
//               <option value="">--Select Badge--</option>
//               {badges.map((badge) => (
//                 <option key={badge.id} value={badge.name}>
//                   {badge.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end">
//             <Button onClick={handleAssignBadge} className="bg-green-500 text-white">
//               Assign Badge
//             </Button>
//           </div>
//         </Modal>
//       )}

//       {/* Toast for success or error message */}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         visible={toast.visible}
//         onClose={() => setToast({ ...toast, visible: false })}
//       />
//     </div>
//   );
// };

// export default AssignBadge;



// import React, { useState, useEffect } from 'react';
// import { updateDocument, getAllDocuments } from '../services/firestoreCRUD';
// import Modal from '../components/common/Modal';
// import Button from '../components/common/Button';
// import Toast from '../components/common/Toast';

// const AssignBadge = () => {
//   const [users, setUsers] = useState([]);
//   const [badges, setBadges] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedBadge, setSelectedBadge] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

//   // Fetch users and badges when the component mounts
//   useEffect(() => {
//     const fetchUsersAndBadges = async () => {
//       try {
//         const usersData = await getAllDocuments('users');
//         setUsers(usersData);

//         const badgesData = await getAllDocuments('badges');
//         setBadges(badgesData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchUsersAndBadges();
//   }, []);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleUserSelection = (userId) => {
//     setSelectedUsers(prev => {
//       if (prev.includes(userId)) {
//         return prev.filter(id => id !== userId); // Deselect if already selected
//       }
//       return [...prev, userId]; // Select user
//     });
//   };

//   const handleAssignBadge = async () => {
//     if (!selectedBadge) {
//       alert('Please select a badge.');
//       return;
//     }

//     try {
//       // Update each selected user's document with the selected badge object
//       await Promise.all(selectedUsers.map(userId =>
//         updateDocument('users', userId, { badge: selectedBadge })
//       ));

//       setToast({
//         message: `Badge "${selectedBadge.name}" assigned to selected users.`,
//         type: 'success',
//         visible: true,
//       });
//       setIsModalOpen(false);
//       setSelectedBadge(null);
//       setSelectedUsers([]);
//     } catch (error) {
//       console.error('Error assigning badge:', error);
//       setToast({
//         message: 'Error assigning badge.',
//         type: 'error',
//         visible: true,
//       });
//     }
//   };

//   // Filter users based on the search term
//   const filteredUsers = users.filter(user =>
//     user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Assign Badge to Users</h1>

//       {/* Button to open modal */}
//       <Button onClick={openModal} className="bg-blue-500 text-white mb-4">
//         Assign Badge
//       </Button>

//       {/* Modal to assign badge */}
//       {isModalOpen && (
//         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Badge">
//           <div className="mb-4">
//             <label htmlFor="userSearch" className="block text-gray-700">Search Users</label>
//             <input
//               type="text"
//               id="userSearch"
//               className="w-full mt-2 p-2 border border-slate-300"
//               placeholder="Type to search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <ul className="mt-2 max-h-60 overflow-y-auto border border-slate-300">
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map(user => (
//                   <li
//                     key={user.id}
//                     onClick={() => handleUserSelection(user.id)}
//                     className={`p-2 cursor-pointer ${selectedUsers.includes(user.id) ? 'bg-blue-200' : ''} hover:bg-slate-200`}
//                   >
//                     {user.fullName}
//                   </li>
//                 ))
//               ) : (
//                 <li className="p-2 text-slate-400">No users found</li>
//               )}
//             </ul>
//           </div>
//           <div className="mb-4">
//             <label htmlFor="badge" className="block text-gray-700">Select Badge</label>
//             <select
//               id="badge"
//               className="w-full mt-2 p-2 border border-slate-300"
//               value={selectedBadge ? selectedBadge.name : ''}
//               onChange={(e) => {
//                 const badge = badges.find(b => b.name === e.target.value);
//                 setSelectedBadge(badge);
//               }}
//             >
//               <option value="">--Select Badge--</option>
//               {badges.map(badge => (
//                 <option key={badge.id} value={badge.name}>
//                   {badge.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex justify-end">
//             <Button onClick={handleAssignBadge} className="bg-green-500 text-white">
//               Assign Badge
//             </Button>
//           </div>
//         </Modal>
//       )}

//       {/* Toast for success or error message */}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         visible={toast.visible}
//         onClose={() => setToast({ ...toast, visible: false })}
//       />
//     </div>
//   );
// };

// export default AssignBadge;


import React, { useState, useEffect } from 'react';
import { updateDocument, getAllDocuments } from '../services/firestoreCRUD';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';

const AssignBadge = () => {
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  // Fetch users and badges when the component mounts
  useEffect(() => {
    const fetchUsersAndBadges = async () => {
      try {
        const usersData = await getAllDocuments('users');
        setUsers(usersData);

        const badgesData = await getAllDocuments('badges');
        setBadges(badgesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersAndBadges();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId); // Deselect if already selected
      }
      return [...prev, userId]; // Select user
    });
  };

  const handleAssignBadge = async () => {
    if (!selectedBadge) {
      alert('Please select a badge.');
      return;
    }

    try {
      // Update each selected user's document with the selected badge object
      await Promise.all(selectedUsers.map(userId =>
        updateDocument('users', userId, { badge: selectedBadge })
      ));

      setToast({
        message: `Badge "${selectedBadge.name}" assigned to selected users.`,
        type: 'success',
        visible: true,
      });
      setIsModalOpen(false);
      setSelectedBadge(null);
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error assigning badge:', error);
      setToast({
        message: 'Error assigning badge.',
        type: 'error',
        visible: true,
      });
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Assign Badge to Users</h1>

      {/* Button to open modal */}
      <Button onClick={openModal} className="bg-blue-500 text-white mb-4">
        Assign Badge
      </Button>

      {/* Modal to assign badge */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Badge">
          <div className="mb-4">
            <label htmlFor="userSearch" className="block text-gray-700">Search Users</label>
            <input
              type="text"
              id="userSearch"
              className="w-full mt-2 p-2 border border-slate-300"
              placeholder="Type to search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="mt-2 max-h-60 overflow-y-auto border border-slate-300">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <li
                    key={user.id}
                    className="p-2 flex items-center cursor-pointer hover:bg-slate-200 transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                      className="mr-2"
                    />
                    {user.fullName}
                  </li>
                ))
              ) : (
                <li className="p-2 text-slate-400">No users found</li>
              )}
            </ul>
          </div>
          
          {/* Display selected users */}
          <div className="mb-4">
            <label className="block text-gray-700">Selected Users</label>
            <input
              type="text"
              value={selectedUsers.map(userId => users.find(user => user.id === userId)?.fullName).join(', ')}
              readOnly
              className="w-full mt-2 p-2 border border-slate-300"
              placeholder="No users selected"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="badge" className="block text-gray-700">Select Badge</label>
            <select
              id="badge"
              className="w-full mt-2 p-2 border border-slate-300"
              value={selectedBadge ? selectedBadge.name : ''}
              onChange={(e) => {
                const badge = badges.find(b => b.name === e.target.value);
                setSelectedBadge(badge);
              }}
            >
              <option value="">--Select Badge--</option>
              {badges.map(badge => (
                <option key={badge.id} value={badge.name}>
                  {badge.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAssignBadge} className="bg-green-500 text-white">
              Assign Badge
            </Button>
          </div>
        </Modal>
      )}

      {/* Toast for success or error message */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default AssignBadge;
