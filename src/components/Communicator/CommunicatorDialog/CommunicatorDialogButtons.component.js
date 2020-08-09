import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '../../UI/IconButton';
import MenuIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { intlShape, FormattedMessage } from 'react-intl';

import messages from './CommunicatorDialog.messages';

class CommunicatorDialogButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: null
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isSearchOpen !== this.props.isSearchOpen &&
      this.props.isSearchOpen
    ) {
      document.getElementById('communicator-dialog-buttons-search').focus();
    }
  }

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ menu: null });
  }

  onSearch(event) {
    const searchValue = event.target.value;
    this.props.onSearch(searchValue);
  }

  render() {
    const { intl, searchValue, isSearchOpen, openSearchBar, dark } = this.props;

    return (
      <div
        className={classNames(
          'CommunicatorDialogButtons__container',
          dark ? 'is-dark' : ''
        )}
      >
        {isSearchOpen && (
          <div className="CommunicatorDialogButtons__searchInput">
            <TextField
              id="communicator-dialog-buttons-search"
              value={searchValue}
              onChange={this.onSearch.bind(this)}
              margin="dense"
              variant="outlined"
            />
          </div>
        )}
        {!isSearchOpen && (
          <div className="CommunicatorDialogButtons__searchButton">
            <IconButton
              id="communicator-dialog-buttons-search-button"
              label={intl.formatMessage(messages.search)}
              onClick={openSearchBar}
            >
              <SearchIcon />
            </IconButton>
          </div>
        )}

        <div className="CommunicatorDialogButtons__menu">
          <IconButton
            id="communicator-dialog-buttons-menu-button"
            label={intl.formatMessage(messages.menu)}
            onClick={this.openMenu.bind(this)}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="communicator-dialog-buttons-menu"
            anchorEl={this.state.menu}
            open={Boolean(this.state.menu)}
            onClose={this.closeMenu.bind(this)}
          >
            <MenuItem>
              <Link to="/settings/help">
                <FormattedMessage {...messages.helpAndSupport} />
              </Link>
            </MenuItem>
            <MenuItem>
              <a
                href="https://www.cboard.io/terms-of-use/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage {...messages.termsOfService} />
              </a>
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}

CommunicatorDialogButtons.propTypes = {
  onSearch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  dark: PropTypes.bool
};

export default CommunicatorDialogButtons;
