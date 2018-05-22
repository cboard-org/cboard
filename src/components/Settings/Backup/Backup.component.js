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
import messages from './Backup.messages';

const propTypes = {
  /**
   * Callback fired when clicking the export button
   */
  onExportClick: PropTypes.func,
  /**
   * Callback fired when clicking the import button
   */
  onImportClick: PropTypes.func,
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func
};

const Backup = ({ onExportClick, onImportClick, onClose }) => (
  <div className="Backup">
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.backup} />}
      onClose={onClose}
    >
      <Paper>
        <List>
          <ListItem>
            <ListItemText
              primary={<FormattedMessage {...messages.backup} />}
              secondary="Backup your boards"
            />
            <ListItemSecondaryAction>
              <Button onClick={e => onExportClick('cboard')}>
                <FormattedMessage {...messages.export} />
              </Button>
              <Button component="span">
                <label htmlFor="file">
                  <FormattedMessage {...messages.restore} />
                </label>
                <input
                  accept=".json,text/json,application/json"
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

Backup.propTypes = propTypes;

export default Backup;
