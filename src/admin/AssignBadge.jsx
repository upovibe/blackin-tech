// import React, { useState, useEffect } from 'react';
// import { updateDocument, getAllDocuments, } from '../services/firestoreCRUD';
// import Modal from '../components/common/Modal';
// import Button from '../components/common/Button';

// const AssignBadge = () => {
//   const [users, setUsers] = useState([]);
//   const [badges, setBadges] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedBadge, setSelectedBadge] = useState("");
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
//       alert(`Badge "${selectedBadge}" assigned to ${selectedUser.name}`);
//       setIsModalOpen(false);
//       setSelectedBadge(""); // Clear selection after assigning
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
//               <td className="px-4 py-2">{user.badge || "None"}</td>
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
//               value={selectedBadge}
//               onChange={(e) => setSelectedBadge(e.target.value)}
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

const AssignBadge = () => {
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null); // Change to hold the whole badge object
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users and badges when the component mounts
  useEffect(() => {
    const fetchUsersAndBadges = async () => {
      try {
        const usersData = await getAllDocuments("users");
        setUsers(usersData);

        const badgesData = await getAllDocuments("badges");
        setBadges(badgesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsersAndBadges();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAssignBadge = async () => {
    if (!selectedBadge) {
      alert("Please select a badge.");
      return;
    }

    try {
      await updateDocument("users", selectedUser.id, { badge: selectedBadge });
      alert(`Badge "${selectedBadge.name}" assigned to ${selectedUser.name}`);
      setIsModalOpen(false);
      setSelectedBadge(null); // Clear selection after assigning
    } catch (error) {
      console.error("Error assigning badge:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Assign Badge to User</h1>

      {/* Table to list users */}
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
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.badge ? user.badge.name : "None"}</td>
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
            <p><strong>User:</strong> {selectedUser.name}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="badge" className="block text-gray-700">Select Badge</label>
            <select
              id="badge"
              className="w-full mt-2 p-2 border"
              value={selectedBadge ? selectedBadge.name : ""}
              onChange={(e) => {
                const badge = badges.find(b => b.name === e.target.value);
                setSelectedBadge(badge); // Set the entire badge object
              }}
            >
              <option value="">--Select Badge--</option>
              {badges.map((badge) => (
                <option key={badge.id} value={badge.name}>
                  {badge.name} - {badge.description}
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
    </div>
  );
};

export default AssignBadge;
