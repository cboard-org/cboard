import React, { useEffect } from 'react';
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
import SearchOffIcon from '@material-ui/icons/CloseRounded';

import messages from './CommunicatorDialog.messages';

const CommunicatorDialogButtons = ({
  intl,
  searchValue,
  isSearchOpen,
  openSearchBar,
  closeSearchBar,
  onSearch,
  dark
}) => {
  const [menu, setMenu] = React.useState(null);
  useEffect(
    () => {
      if (isSearchOpen) {
        document.getElementById('communicator-dialog-buttons-search').focus();
      }
    },
    [isSearchOpen]
  );

  const handleOpenMenu = e => {
    setMenu(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenu(null);
  };

  const handleSearchChange = event => {
    onSearch(event.target.value);
  };

  const handleCloseSearch = () => {
    closeSearchBar();
  };

  return (
    <div
      className={classNames(
        'CommunicatorDialogButtons__container',
        dark ? 'is-dark' : ''
      )}
    >
      {isSearchOpen && (
        <div className="CommunicatorDialogButtons__searchInput">
          <IconButton
            id="communicator-dialog-buttons-search-close-button"
            label={intl.formatMessage(messages.close)}
            onClick={handleCloseSearch}
          >
            <SearchOffIcon />
          </IconButton>
          <TextField
            id="communicator-dialog-buttons-search"
            value={searchValue}
            onChange={handleSearchChange}
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
          onClick={handleOpenMenu}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="communicator-dialog-buttons-menu"
          anchorEl={menu}
          open={Boolean(menu)}
          onClose={handleCloseMenu}
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
};

CommunicatorDialogButtons.propTypes = {
  onSearch: PropTypes.func.isRequired,
  closeSearchBar: PropTypes.func.isRequired,
  openSearchBar: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  dark: PropTypes.bool,
  isSearchOpen: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired
};

export default CommunicatorDialogButtons;
