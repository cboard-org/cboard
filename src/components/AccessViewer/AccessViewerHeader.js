import React from 'react';
import PropTypes from 'prop-types';
import './AccessViewer.css';

const AccessViewerHeader = ({ clientName, brandColor }) => {
  return (
    <div
      className="AccessViewer__header"
      style={{ backgroundColor: brandColor || '#1976d2' }}
    >
      <span className="AccessViewer__header-name">{clientName}</span>
    </div>
  );
};

AccessViewerHeader.propTypes = {
  clientName: PropTypes.string.isRequired,
  brandColor: PropTypes.string
};

export default AccessViewerHeader;
