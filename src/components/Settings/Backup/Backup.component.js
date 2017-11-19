import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';

import FullScreenDialog from '../../FullScreenDialog';
import messages from './Backup.messages';

const propTypes = {
  /**
   * If true, displays the component
   */
  open: PropTypes.bool,
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
  onRequestClose: PropTypes.func
};

const Backup = ({
  open,

  onExportClick,
  onImportClick,
  onRequestClose
}) => (
  <div className="Backup">
    <FullScreenDialog
      open={open}
      title={<FormattedMessage {...messages.backup} />}
      onRequestClose={onRequestClose}
    >
      <List>
        <ListItem>
          <ListItemText
            primary={<FormattedMessage {...messages.backup} />}
            secondary="Backup your boards"
          />
          <ListItemSecondaryAction>
            <Button onClick={onExportClick}>
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
                onChange={e => onImportClick(e)}
              />
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </FullScreenDialog>
  </div>
);

Backup.propTypes = propTypes;

export default Backup;
