import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';

import FullScreenDialog from '../../../components/FullScreenDialog';
import ExportButton from '../../../components/ExportButton';
import messages from './messages';

export class Backup extends PureComponent {
  handleExportClick = () => {
    const exportFilename = 'board.json';
    const { boards } = this.props;
    const jsonData = new Blob([JSON.stringify(boards)], {
      type: 'text/json;charset=utf-8;'
    });

    // IE11 & Edge
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(jsonData, exportFilename);
    } else {
      // In FF link must be added to DOM to be clicked
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(jsonData);
      link.setAttribute('download', exportFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  render() {
    const { open, onCancel } = this.props;

    return (
      <div className="Backup">
        <FullScreenDialog
          open={open}
          title={<FormattedMessage {...messages.backup} />}
          onCancel={onCancel}
        >
          <List>
            <ListItem divider>
              <ListItemText primary="Backup" secondary="Backup your boards" />
              <ListItemSecondaryAction>
                <ExportButton
                  message={messages.export}
                  onClick={this.handleExportClick}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </FullScreenDialog>
      </div>
    );
  }
}

Backup.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func
};

export default Backup;
