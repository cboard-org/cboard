import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Export.messages';

const propTypes = {
  /**
   * Callback fired when clicking the export Cboard button
   */
  onExportClick: PropTypes.func.isRequired,
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func
};

class Export extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exportMenu: null
    };
  }

  openMenu(e) {
    this.setState({ exportMenu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ exportMenu: null });
  }

  onExportClick(type = 'cboard') {
    this.props.onExportClick(type);
    this.closeMenu();
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className="Export">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.export} />}
          onClose={onClose}
        >
          <Paper>
            <List>
              <ListItem>
                <ListItemText
                  primary={<FormattedMessage {...messages.export} />}
                  secondary={
                    <FormattedMessage
                      {...messages.exportSecondary}
                      link={
                        <a href="http://www.openboardformat.org/">
                          <FormattedMessage {...messages.openboardLink} />
                        </a>
                      }
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <Button id="export-button" onClick={this.openMenu.bind(this)}>
                    <FormattedMessage {...messages.export} />
                  </Button>
                  <Menu
                    id="export-menu"
                    anchorEl={this.state.exportMenu}
                    open={Boolean(this.state.exportMenu)}
                    onClose={this.closeMenu.bind(this)}
                  >
                    <MenuItem onClick={this.onExportClick.bind(this, 'cboard')}>
                      Cboard
                    </MenuItem>
                    <MenuItem
                      onClick={this.onExportClick.bind(this, 'openboard')}
                    >
                      OpenBoard
                    </MenuItem>
                    {/* <MenuItem onClick={this.onExportClick.bind(this, 'pdf')}>
                      PDF
                    </MenuItem>
                    <MenuItem onClick={this.onExportClick.bind(this, 'image')}>
                      Image
                    </MenuItem> */}
                  </Menu>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

Export.propTypes = propTypes;

export default Export;
