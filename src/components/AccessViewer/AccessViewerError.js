import React from 'react';
import PropTypes from 'prop-types';
import ErrorIcon from '@material-ui/icons/Error';
import BlockIcon from '@material-ui/icons/Block';
import './AccessViewer.css';

const ERROR_MESSAGES = {
  invalid: {
    Icon: ErrorIcon,
    title: 'Invalid or expired access code',
    description:
      'The access code you are trying to use does not exist or has expired. Contact the establishment for more information.'
  },
  forbidden: {
    Icon: BlockIcon,
    title: 'Access not allowed',
    description: 'This board is not available with the provided code.'
  },
  error: {
    Icon: ErrorIcon,
    title: 'Connection error',
    description:
      'We could not load the board. Please check your connection and try again.'
  }
};

const AccessViewerError = ({ type }) => {
  const { Icon, title, description } =
    ERROR_MESSAGES[type] || ERROR_MESSAGES.error;

  return (
    <div className="AccessViewer__error">
      <Icon className="AccessViewer__error-icon" />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

AccessViewerError.propTypes = {
  type: PropTypes.oneOf(['invalid', 'forbidden', 'error']).isRequired
};

export default AccessViewerError;
