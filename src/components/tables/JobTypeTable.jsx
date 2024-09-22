import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaBriefcase } from 'react-icons/fa'; // Icon for job types
import RightSidebar from '../common/RightSidebar'; // Adjust the path as needed
import Modal from '../common/Modal'; // Assuming you have a modal component
import JobTypesForm from '../forms/JobTypesForm'; // The job types form

const JobTypesTable = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for adding new job types
  const [selectedJobType, setSelectedJobType] = useState(null); // Selected job type for sidebar details
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobTypes', (data) => {
      setJobTypes(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (jobType, updatedData) => {
    const updatedJobType = { ...jobType, ...updatedData };
    updateDocument('jobTypes', updatedJobType.id, updatedJobType)
      .then(() => console.log('Job Type updated successfully'))
      .catch((error) => console.error('Error updating job type:', error));
  };

  const handleDelete = (jobType) => {
    deleteDocument('jobTypes', jobType.id)
      .then(() => console.log('Job Type deleted successfully'))
      .catch((error) => console.error('Error deleting job type:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobTypeToDelete = jobTypes.find((jobType) => jobType.id === rowId);
      if (jobTypeToDelete) {
        deleteDocument('jobTypes', jobTypeToDelete.id)
          .then(() => console.log(`Job Type ${jobTypeToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job type:', error));
      }
    });

    setJobTypes((prevJobTypes) => prevJobTypes.filter((jobType) => !selectedRows.has(jobType.id)));
    setSelectedRows(new Set());
  };

  const handleViewJobType = (jobType) => {
    setSelectedJobType(jobType); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedJobType(null); // Clear selected job type
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
        title="Job Types Table"
        icon={<FaBriefcase />}
        columns={columns}
        data={jobTypes}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewJobType}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Job Type Details"
      >
        {selectedJobType ? (
          <div>
            <p><strong>Name:</strong> {selectedJobType.name}</p>
            <p><strong>Slug:</strong> {selectedJobType.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No job type selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Job Types */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Job Type"
      >
        <JobTypesForm 
          jobType={selectedJobType} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default JobTypesTable;
