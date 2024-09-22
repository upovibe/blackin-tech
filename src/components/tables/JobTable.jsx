import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaBriefcase } from 'react-icons/fa'; // Change the icon as needed
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';
import JobForm from '../forms/JobForm'; // Import the JobForm

const JobTable = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobs', (data) => {
      setJobs(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    {
      Header: 'Logo',
      accessor: 'logo',
      type: 'image',
      Cell: ({ value }) => (
        <div>
          <img
            src={value || 'https://via.placeholder.com/50'}
            alt="Logo"
          />
        </div>
      ),
    },
    { Header: 'Company', accessor: 'companyName', type: 'text' },
    { Header: 'Job Title', accessor: 'title', type: 'text' },
    { Header: 'Location', accessor: 'location', type: 'text' },
    { Header: 'JobType', accessor: 'jobType', type: 'text' },
    { Header: 'PostedBy', accessor: 'posterUsername', type: 'text' },
  ];

  const handleUpdate = (job, updatedData) => {
    const updatedJob = { ...job, ...updatedData };
    updateDocument('jobs', updatedJob.id, updatedJob)
      .then(() => console.log('Job updated successfully'))
      .catch((error) => console.error('Error updating job:', error));
  };

  const handleDelete = (job) => {
    deleteDocument('jobs', job.id)
      .then(() => console.log('Job deleted successfully'))
      .catch((error) => console.error('Error deleting job:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobToDelete = jobs.find((job) => job.id === rowId);
      if (jobToDelete) {
        deleteDocument('jobs', jobToDelete.id)
          .then(() => console.log(`Job ${jobToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job:', error));
      }
    });

    setJobs((prevJobs) => prevJobs.filter((job) => !selectedRows.has(job.id)));
    setSelectedRows(new Set());
  };

  const handleViewJob = (job) => {
    setSelectedJob(job); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedJob(null); 
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
        title="Job Table"
        icon={<FaBriefcase />} // Change the icon if desired
        columns={columns}
        data={jobs}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewJob}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Job Details"
      >
        {selectedJob ? (
          <div>
            <p><strong>Company Name:</strong> {selectedJob.companyName}</p>
            <p><strong>Title:</strong> {selectedJob.title}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No job selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Jobs */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Job"
      >
        <JobForm 
          job={selectedJob} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default JobTable;
