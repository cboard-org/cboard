import React from 'react';

import { SimpleCard, MatxProgressBar } from 'matx';

const Campaigns = () => {
  return (
    <div>
      <SimpleCard title="Most used Boards">
        <div className="pt-2" />
        <MatxProgressBar value={75} color="primary" text="Home" />
        <div className="py-1" />
        <MatxProgressBar value={65} color="secondary" text="Quick chat" />
        <div className="py-1" />
        <MatxProgressBar value={55} color="primary" text="Vegetables" />
        <div className="py-1" />
        <MatxProgressBar value={55} color="primary" text="Numbers" />
        <div className="py-1" />
        <MatxProgressBar value={55} color="primary" text="Animals" />
      </SimpleCard>
    </div>
  );
};

export default Campaigns;
