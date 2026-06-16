import React from 'react';

const CboardAccessList = () => {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px'
      }}
    >
      <h3>Cboard Access Control List</h3>
      <ul>
        <li>User 1 (Admin) - Full Access</li>
        <li>User 2 (Editor) - View & Edit</li>
        <li>User 3 (Viewer) - Read Only</li>
      </ul>
    </div>
  );
};

export default CboardAccessList;
