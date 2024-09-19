import React, { useState } from 'react';
import Table from '../common/Table';

const JobsPage = () => {
  const [jobData, setJobData] = useState([
    { id: 1, title: 'Software Engineer', type: 'Full-time' },
    { id: 2, title: 'Product Manager', type: 'Part-time' },
    { id: 2, title: 'Product Manager', type: 'Part-time' },
    { id: 2, title: 'Product Manager', type: 'Part-time' },
    { id: 2, title: 'Product Manager', type: 'Part-time' },
    { id: 2, title: 'Product Manager', type: 'Part-time' },
    { id: 2, title: 'Product Manager', type: 'Part-time' },
    // ...more data
  ]);

  const jobColumns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Title', accessor: 'title' },
    { Header: 'Type', accessor: 'type' },
  ];

  const handleEdit = (job) => {
    console.log('Edit job:', job);
    setJobData(jobData.map((j) => (j.id === job.id ? job : j)));
  };

  const handleDelete = (job) => {
    console.log('Delete job:', job);
    setJobData(jobData.filter((j) => j.id !== job.id));
  };

  return (
    <div>
      <h1>Jobs</h1>
      <Table
        columns={jobColumns}
        data={jobData}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default JobsPage;
