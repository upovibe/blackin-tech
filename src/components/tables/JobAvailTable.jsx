import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaBriefcase } from 'react-icons/fa';
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';
import JobAvailForm from '../forms/JobAvailForm'; 

const JobAvailTable = () => {
  const [jobAvailabilities, setJobAvailabilities] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobAvailability, setSelectedJobAvailability] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobAvailabilities', (data) => {
      setJobAvailabilities(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (jobAvailability, updatedData) => {
    const updatedJobAvailability = { ...jobAvailability, ...updatedData };
    updateDocument('jobAvailabilities', updatedJobAvailability.id, updatedJobAvailability)
      .then(() => console.log('Job Availability updated successfully'))
      .catch((error) => console.error('Error updating job availability:', error));
  };

  const handleDelete = (jobAvailability) => {
    deleteDocument('jobAvailabilities', jobAvailability.id)
      .then(() => console.log('Job Availability deleted successfully'))
      .catch((error) => console.error('Error deleting job availability:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobAvailabilityToDelete = jobAvailabilities.find((jobAvailability) => jobAvailability.id === rowId);
      if (jobAvailabilityToDelete) {
        deleteDocument('jobAvailabilities', jobAvailabilityToDelete.id)
          .then(() => console.log(`Job Availability ${jobAvailabilityToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job availability:', error));
      }
    });

    setJobAvailabilities((prevJobAvailabilities) => prevJobAvailabilities.filter((jobAvailability) => !selectedRows.has(jobAvailability.id)));
    setSelectedRows(new Set());
  };

  const handleViewJobAvailability = (jobAvailability) => {
    setSelectedJobAvailability(jobAvailability); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedJobAvailability(null); 
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
        title="Job Availabilities Table"
        icon={<FaBriefcase />}
        columns={columns}
        data={jobAvailabilities}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewJobAvailability}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Job Availability Details"
      >
        {selectedJobAvailability ? (
          <div>
            <p><strong>Name:</strong> {selectedJobAvailability.name}</p>
            <p><strong>Slug:</strong> {selectedJobAvailability.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No job availability selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Job Availabilities */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Job Availability"
      >
        <JobAvailForm 
          jobAvailability={selectedJobAvailability} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default JobAvailTable;
