import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaTools } from 'react-icons/fa'; // Change the icon as needed
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';
import JobAbilitiesForm from '../forms/JobAbilitiesForm'; // Import the JobAbilitiesForm

const JobAbilitiesTable = () => {
  const [jobAbilities, setJobAbilities] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobAbility, setSelectedJobAbility] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobAbilities', (data) => {
      setJobAbilities(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (jobAbility, updatedData) => {
    const updatedJobAbility = { ...jobAbility, ...updatedData };
    updateDocument('jobAbilities', updatedJobAbility.id, updatedJobAbility)
      .then(() => console.log('Job Ability updated successfully'))
      .catch((error) => console.error('Error updating job ability:', error));
  };

  const handleDelete = (jobAbility) => {
    deleteDocument('jobAbilities', jobAbility.id)
      .then(() => console.log('Job Ability deleted successfully'))
      .catch((error) => console.error('Error deleting job ability:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobAbilityToDelete = jobAbilities.find((jobAbility) => jobAbility.id === rowId);
      if (jobAbilityToDelete) {
        deleteDocument('jobAbilities', jobAbilityToDelete.id)
          .then(() => console.log(`Job Ability ${jobAbilityToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job ability:', error));
      }
    });

    setJobAbilities((prevJobAbilities) => prevJobAbilities.filter((jobAbility) => !selectedRows.has(jobAbility.id)));
    setSelectedRows(new Set());
  };

  const handleViewJobAbility = (jobAbility) => {
    setSelectedJobAbility(jobAbility); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedJobAbility(null); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Table
        title="Job Abilities Table"
        icon={<FaTools />} // Change the icon if desired
        columns={columns}
        data={jobAbilities}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewJobAbility}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Job Ability Details"
      >
        {selectedJobAbility ? (
          <div>
            <p><strong>Name:</strong> {selectedJobAbility.name}</p>
            <p><strong>Slug:</strong> {selectedJobAbility.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No job ability selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Job Abilities */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Job Ability"
      >
        <JobAbilitiesForm 
          jobAbility={selectedJobAbility} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default JobAbilitiesTable;
