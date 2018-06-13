import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Import.messages';

const propTypes = {
  /**
   * Callback fired when clicking the import Cboard button
   */
  onImportClick: PropTypes.func.isRequired,
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func
};

const Import = ({ onClose, onImportClick }) => (
  <div className="Import">
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.import} />}
      onClose={onClose}
    >
      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary={<FormattedMessage {...messages.import} />}
              secondary={<FormattedMessage {...messages.importSecondary} />}
            />
            <ListItemSecondaryAction>
              <Button component="span">
                <label htmlFor="file">
                  <FormattedMessage {...messages.restore} />
                </label>
                <input
                  accept=".json,.obz,.obf,text/json,application/json"
                  id="file"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={onImportClick}
                />
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </FullScreenDialog>
  </div>
);

Import.propTypes = propTypes;

export default Import;
