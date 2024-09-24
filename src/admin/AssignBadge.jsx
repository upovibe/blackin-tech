// // import React, { useState, useEffect } from 'react';
// // import { updateDocument, getAllDocuments, } from '../services/firestoreCRUD';
// // import Modal from '../components/common/Modal';
// // import Button from '../components/common/Button';

// // const AssignBadge = () => {
// //   const [users, setUsers] = useState([]);
// //   const [badges, setBadges] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [selectedBadge, setSelectedBadge] = useState("");
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   // Fetch users and badges when the component mounts
// //   useEffect(() => {
// //     const fetchUsersAndBadges = async () => {
// //       try {
// //         const usersData = await getAllDocuments("users");
// //         setUsers(usersData);

// //         const badgesData = await getAllDocuments("badges");
// //         setBadges(badgesData);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     fetchUsersAndBadges();
// //   }, []);

// //   const openModal = (user) => {
// //     setSelectedUser(user);
// //     setIsModalOpen(true);
// //   };

// //   const handleAssignBadge = async () => {
// //     if (!selectedBadge) {
// //       alert("Please select a badge.");
// //       return;
// //     }

// //     try {
// //       await updateDocument("users", selectedUser.id, { badge: selectedBadge });
// //       alert(`Badge "${selectedBadge}" assigned to ${selectedUser.name}`);
// //       setIsModalOpen(false);
// //       setSelectedBadge(""); // Clear selection after assigning
// //     } catch (error) {
// //       console.error("Error assigning badge:", error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-semibold mb-4">Assign Badge to User</h1>

// //       {/* Table to list users */}
// //       <table className="table-auto w-full text-left">
// //         <thead>
// //           <tr className="bg-gray-200">
// //             <th className="px-4 py-2">Name</th>
// //             <th className="px-4 py-2">Email</th>
// //             <th className="px-4 py-2">Badge</th>
// //             <th className="px-4 py-2">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {users.map((user) => (
// //             <tr key={user.id} className="border-b">
// //               <td className="px-4 py-2">{user.name}</td>
// //               <td className="px-4 py-2">{user.email}</td>
// //               <td className="px-4 py-2">{user.badge || "None"}</td>
// //               <td className="px-4 py-2">
// //                 <Button onClick={() => openModal(user)} className="bg-blue-500 text-white">
// //                   Assign Badge
// //                 </Button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       {/* Modal to assign badge */}
// //       {isModalOpen && (
// //         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Badge">
// //           <div className="mb-4">
// //             <p><strong>User:</strong> {selectedUser.name}</p>
// //           </div>
// //           <div className="mb-4">
// //             <label htmlFor="badge" className="block text-gray-700">Select Badge</label>
// //             <select
// //               id="badge"
// //               className="w-full mt-2 p-2 border"
// //               value={selectedBadge}
// //               onChange={(e) => setSelectedBadge(e.target.value)}
// //             >
// //               <option value="">--Select Badge--</option>
// //               {badges.map((badge) => (
// //                 <option key={badge.id} value={badge.name}>
// //                   {badge.name} - {badge.description}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="flex justify-end">
// //             <Button onClick={handleAssignBadge} className="bg-green-500 text-white">
// //               Assign Badge
// //             </Button>
// //           </div>
// //         </Modal>
// //       )}
// //     </div>
// //   );
// // };

// // export default AssignBadge;



// import React, { useState, useEffect } from 'react';
// import { updateDocument, getAllDocuments } from '../services/firestoreCRUD';
// import Modal from '../components/common/Modal';
// import Button from '../components/common/Button';

// const AssignBadge = () => {
//   const [users, setUsers] = useState([]);
//   const [badges, setBadges] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedBadge, setSelectedBadge] = useState(null); // Change to hold the whole badge object
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch users and badges when the component mounts
//   useEffect(() => {
//     const fetchUsersAndBadges = async () => {
//       try {
//         const usersData = await getAllDocuments("users");
//         setUsers(usersData);

//         const badgesData = await getAllDocuments("badges");
//         setBadges(badgesData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchUsersAndBadges();
//   }, []);

//   const openModal = (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   const handleAssignBadge = async () => {
//     if (!selectedBadge) {
//       alert("Please select a badge.");
//       return;
//     }

//     try {
//       await updateDocument("users", selectedUser.id, { badge: selectedBadge });
//       alert(`Badge "${selectedBadge.name}" assigned to ${selectedUser.name}`);
//       setIsModalOpen(false);
//       setSelectedBadge(null); // Clear selection after assigning
//     } catch (error) {
//       console.error("Error assigning badge:", error);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Assign Badge to User</h1>

//       {/* Table to list users */}
//       <table className="table-auto w-full text-left">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="px-4 py-2">Name</th>
//             <th className="px-4 py-2">Email</th>
//             <th className="px-4 py-2">Badge</th>
//             <th className="px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id} className="border-b">
//               <td className="px-4 py-2">{user.name}</td>
//               <td className="px-4 py-2">{user.email}</td>
//               <td className="px-4 py-2">{user.badge ? user.badge.name : "None"}</td>
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
//             <p><strong>User:</strong> {selectedUser.name}</p>
//           </div>
//           <div className="mb-4">
//             <label htmlFor="badge" className="block text-gray-700">Select Badge</label>
//             <select
//               id="badge"
//               className="w-full mt-2 p-2 border"
//               value={selectedBadge ? selectedBadge.name : ""}
//               onChange={(e) => {
//                 const badge = badges.find(b => b.name === e.target.value);
//                 setSelectedBadge(badge); // Set the entire badge object
//               }}
//             >
//               <option value="">--Select Badge--</option>
//               {badges.map((badge) => (
//                 <option key={badge.id} value={badge.name}>
//                   {badge.name} - {badge.description}
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
//     </div>
//   );
// };

// export default AssignBadge;


import React, { useState, useEffect } from 'react';
import { updateDocument, getAllDocuments } from '../services/firestoreCRUD';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import SelectInput from '../components/common/SelectInput'; // Import your custom SelectInput component

const AssignBadgeForm = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchUsersAndBadges = async () => {
      try {
        const usersData = await getAllDocuments('users');
        setUsers(usersData);
        setFilteredUsers(usersData);

        const badgesData = await getAllDocuments('badges');
        setBadges(badgesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersAndBadges();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchResults = users.filter((user) =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(searchResults);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAssignBadge = async () => {
    if (!selectedBadge) {
      setToast({ visible: true, message: 'Please select a badge.', type: 'error' });
      return;
    }

    try {
      await updateDocument('users', selectedUser.id, { badge: selectedBadge });
      setToast({
        visible: true,
        message: `Badge "${selectedBadge.name}" assigned to ${selectedUser.name}`,
        type: 'success',
      });
      setIsModalOpen(false);
      setSelectedBadge(null);
    } catch (error) {
      console.error('Error assigning badge:', error);
      setToast({ visible: true, message: 'Error assigning badge.', type: 'error' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Assign Badge to User</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users by name or email"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Table to list filtered users */}
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Badge</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.badge ? user.badge.name : 'None'}</td>
              <td className="px-4 py-2">
                <Button onClick={() => openModal(user)} className="bg-blue-500 text-white">
                  Assign Badge
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to assign badge */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Badge">
          <div className="mb-4">
            <p>
              <strong>User:</strong> {selectedUser.name}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="badge" className="block text-gray-700">
              Select Badge
            </label>
            <SelectInput
              options={badges.map((badge) => ({
                label: `${badge.name} - ${badge.description}`,
                value: badge,
              }))}
              placeholder="Select Badge"
              className="w-full"
              onChange={(e) => {
                const selected = badges.find((badge) => badge.name === e.target.value);
                setSelectedBadge(selected);
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAssignBadge} className="bg-green-500 text-white">
              Assign Badge
            </Button>
          </div>
        </Modal>
      )}

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default AssignBadgeForm;
