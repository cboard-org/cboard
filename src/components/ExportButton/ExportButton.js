import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';

const styles = {
  AppBar: {
    position: 'relative',
    top: 0
  }
}

function ExportButton({ classes, className, message, handleExportClick, children }) {
  return (
    <Button color="contrast" onClick={handleExportClick}>
        <FormattedMessage {...message} />
    </Button>
  );
}

ExportButton.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.object,
  handleExportClick: PropTypes.func,
  children: PropTypes.node
};

export default withStyles(styles, { name: 'ExportButton' })(ExportButton);
