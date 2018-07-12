import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '../../UI/IconButton';
import MenuIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { intlShape } from 'react-intl';

import messages from './CommunicatorDialog.messages';

class CommunicatorDialogButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      showSearchBar: false,
      menu: null
    };
  }

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ menu: null });
  }

  openSearchBar() {
    this.setState({ showSearchBar: true });
  }

  onSearch(event) {
    const searchValue = event.target.value;

    this.setState({ searchValue });
    this.props.onSearch(searchValue);
  }

  render() {
    const { intl } = this.props;

    return (
      <div className="CommunicatorDialogButtons__container">
        {this.state.showSearchBar && (
          <div className="CommunicatorDialogButtons__searchInput">
            <TextField
              id="communicator-search"
              value={this.state.searchValue}
              onChange={this.onSearch.bind(this)}
              margin="normal"
            />
          </div>
        )}
        {!this.state.showSearchBar && (
          <div className="CommunicatorDialogButtons__searchButton">
            <IconButton
              label={intl.formatMessage(messages.search)}
              onClick={this.openSearchBar.bind(this)}
            >
              <SearchIcon />
            </IconButton>
          </div>
        )}

        <div className="CommunicatorDialogButtons__menu">
          <IconButton
            label={intl.formatMessage(messages.menu)}
            onClick={this.openMenu.bind(this)}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="communicator-dialog-buttons-menu-button"
            anchorEl={this.state.menu}
            open={Boolean(this.state.menu)}
            onClose={this.closeMenu.bind(this)}
          >
            <MenuItem onClick={() => {}}>...</MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}

CommunicatorDialogButtons.propTypes = {
  onSearch: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default CommunicatorDialogButtons;
