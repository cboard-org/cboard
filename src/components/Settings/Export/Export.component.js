import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Export.messages';

import './Export.css';

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
      exportMenu: null,
      loading: false
    };
  }

  openMenu(e) {
    this.setState({ exportMenu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ exportMenu: null });
  }

  onExportClick(type = 'cboard') {
    const doneCallback = () => {
      this.setState({ loading: false });
    };

    this.setState({ loading: true, exportMenu: null }, () => {
      this.props.onExportClick(type, doneCallback);
    });
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
                  className="Export__ListItemText"
                  primary={<FormattedMessage {...messages.export} />}
                  secondary={
                    <FormattedMessage
                      {...messages.exportSecondary}
                      values={{
                        cboardLink: (
                          <a href="https://www.cboard.io/help/#HowdoIimportaboardintoCboard">
                            Cboard
                          </a>
                        ),
                        link: (
                          <a href="https://www.openboardformat.org/">
                            OpenBoard
                          </a>
                        )
                      }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <div className="Export__ButtonContainer">
                    {this.state.loading && (
                      <CircularProgress
                        size={25}
                        className="Export__ButtonContainer--spinner"
                        thickness={7}
                      />
                    )}
                    <Button
                      id="export-button"
                      color="primary"
                      disabled={this.state.loading}
                      onClick={this.openMenu.bind(this)}
                    >
                      <ArrowDropDownIcon />
                      <FormattedMessage {...messages.export} />
                    </Button>
                    <Menu
                      id="export-menu"
                      anchorEl={this.state.exportMenu}
                      open={Boolean(this.state.exportMenu)}
                      onClose={this.closeMenu.bind(this)}
                    >
                      <MenuItem
                        onClick={this.onExportClick.bind(this, 'cboard')}
                      >
                        Cboard
                      </MenuItem>
                      <MenuItem
                        onClick={this.onExportClick.bind(this, 'openboard')}
                      >
                        OpenBoard
                      </MenuItem>
                      <MenuItem onClick={this.onExportClick.bind(this, 'pdf')}>
                        PDF
                      </MenuItem>
                      {/*
                      <MenuItem onClick={this.onExportClick.bind(this, 'image')}>
                        Image
                      </MenuItem>
                      */}
                    </Menu>
                  </div>
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
