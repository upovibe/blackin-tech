import React, { useEffect, useState } from 'react';
import { listenToCollection, deleteDocument } from '../../services/firestoreCRUD';
import Table from '../common/Table';
import { FaBriefcase } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const JobTable = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set()); // Track selected rows
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobs', (data) => {
      console.log(data); // Check what data is received
      setJobs(data); 
    });

    return () => unsubscribe();
  }, []);

  // Define columns for the job table
  const columns = [
    {
      Header: 'Logo',
      accessor: 'logo',
      type: 'image',
      Cell: ({ value }) => (
        <div>
          <img
            src={value || 'https://via.placeholder.com/50'}
            alt="Company Logo"
          />
        </div>
      ),
    },
    { Header: 'Company', accessor: 'companyName', type: 'text' },
    { Header: 'Title', accessor: 'title', type: 'text' },
    { Header: 'Location', accessor: 'location', type: 'text' },
    { Header: 'Job Type', accessor: 'jobType', type: 'text' },
  ];

  // Handle delete function
  const handleDelete = (job) => {
    deleteDocument('jobs', job.id)
      .then(() => console.log('Job deleted successfully'))
      .catch((error) => console.error('Error deleting job:', error));
  };

  // Handle bulk delete function
  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobToDelete = jobs.find((job) => job.id === rowId);
      if (jobToDelete) {
        deleteDocument('jobs', jobToDelete.id)
          .then(() => console.log(`Job ${jobToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job:', error));
      }
    });

    // Remove the deleted rows from the UI
    setJobs((prevJobs) => prevJobs.filter((job) => !selectedRows.has(job.id)));

    // Clear selected rows after deletion
    setSelectedRows(new Set());
  };

  return (
    <Table
      title="Job Listings"
      icon={<FaBriefcase />}
      columns={columns}
      data={jobs}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      sortable={true}
      filterable={true}
      pagination={true}
      onDelete={handleDelete}
      handleBulkDelete={handleBulkDelete}
      onView={(job) => navigate(`/jobs/${job.slug}`)}
      className="w-full text-sm text-gray-700"
    />
  );
};

export default JobTable;
