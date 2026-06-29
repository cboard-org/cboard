import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import ErrorIcon from '@material-ui/icons/Error';
import BlockIcon from '@material-ui/icons/Block';
import messages from './AccessViewer.messages';
import './AccessViewer.css';

const ERROR_CONFIG = {
  invalid: {
    Icon: ErrorIcon,
    title: 'invalidTitle',
    description: 'invalidDescription'
  },
  forbidden: {
    Icon: BlockIcon,
    title: 'forbiddenTitle',
    description: 'forbiddenDescription'
  },
  error: {
    Icon: ErrorIcon,
    title: 'errorTitle',
    description: 'errorDescription'
  }
};

const AccessViewerError = ({ type, intl }) => {
  const { Icon, title, description } = ERROR_CONFIG[type] || ERROR_CONFIG.error;

  return (
    <div className="AccessViewer__error">
      <Icon className="AccessViewer__error-icon" />
      <h2>{intl.formatMessage(messages[title])}</h2>
      <p>{intl.formatMessage(messages[description])}</p>
    </div>
  );
};

AccessViewerError.propTypes = {
  type: PropTypes.oneOf(['invalid', 'forbidden', 'error']).isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(AccessViewerError);
