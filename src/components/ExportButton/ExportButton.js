import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';

function ExportButton({ message, onClick, children }) {
  return (
    <Button onClick={onClick}>
      <FormattedMessage {...message} />
    </Button>
  );
}

ExportButton.propTypes = {
  message: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.node
};

export default ExportButton;
