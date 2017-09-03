import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';

import FullScreenDialog from '../../../components/FullScreenDialog';
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
    const { open, onCancel, onImport } = this.props;

    return (
      <div className="Backup">
        <FullScreenDialog
          open={open}
          title={<FormattedMessage {...messages.backup} />}
          onCancel={onCancel}
        >
          <List>
            <ListItem divider>
              <ListItemText primary={<FormattedMessage {...messages.backup} />} secondary="Backup your boards" />
              <ListItemSecondaryAction>
                <Button onClick={this.handleExportClick}>
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
                    onChange={e => onImport(e)}
                  />
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </FullScreenDialog>
      </div>
    );
  }
}

Backup.propTypes = {
  boards: PropTypes.array.isRequired,
  open: PropTypes.bool,
  onCancel: PropTypes.func
};

export default Backup;
