import React, { useState } from 'react';
// TASK 1: Import the CboardAccessList component
import CboardAccessList from './CboardAccessList';

const CommunicatorBuild = () => {
  // State to manage which tab is currently selected
  const [activeTab, setActiveTab] = useState('build');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Communicator Build Interface</h2>

      {/* Tab Navigation Headers */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #ccc',
          marginBottom: '15px'
        }}
      >
        <button
          onClick={() => setActiveTab('build')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'build' ? '2px solid green' : 'none',
            fontWeight: activeTab === 'build' ? 'bold' : 'normal'
          }}
        >
          Build/Communicator
        </button>

        {/* TASK 2: Add "Cboard Access" tab/section button */}
        <button
          onClick={() => setActiveTab('access')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'access' ? '2px solid green' : 'none',
            fontWeight: activeTab === 'access' ? 'bold' : 'normal'
          }}
        >
          Cboard Access
        </button>
      </div>

      {/* Tab Panel Content Display */}
      <div style={{ padding: '10px' }}>
        {activeTab === 'build' && (
          <div>
            <p>
              This is the standard Communicator Build editing interface
              workspace.
            </p>
          </div>
        )}

        {/* TASK 3: Render CboardAccessList in the appropriate tab panel */}
        {activeTab === 'access' && <CboardAccessList />}
      </div>
    </div>
  );
};

export default CommunicatorBuild;
