import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import isMobile from 'ismobilejs';
import { Scannable } from 'react-scannable';
import { IconButton } from '@material-ui/core';
import ScannerDeactivateIcon from '@material-ui/icons/ExploreOff';

import BoardShare from '../BoardShare';
import FullScreenButton from '../../UI/FullScreenButton';
import PrintBoardButton from '../../UI/PrintBoardButton';
import UserIcon from '../../UI/UserIcon';
import LockToggle from '../../UI/LockToggle';
import BackButton from '../../UI/BackButton';
import AnalyticsButton from '../../UI/AnalyticsButton';
import HelpButton from '../../UI/HelpButton';
import SettingsButton from '../../UI/SettingsButton';
import messages from '../Board.messages';
import { isCordova, isAndroid } from '../../../cordova-util';
import './Navbar.css';
import { injectIntl } from 'react-intl';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backButton: false,
      openShareDialog: false,
      deactivateScannerButton: false
    };
  }

  onShareClick = () => {
    this.setState({ openShareDialog: true });
  };

  onShareClose = () => {
    this.setState({ openShareDialog: false });
  };

  publishBoard = () => {
    this.props.publishBoard();
  };

  handleCopyLink = async () => {
    const { intl, showNotification } = this.props;
    try {
      if (isAndroid()) {
        await window.cordova.plugins.clipboard.copy(this.getBoardToShare());
      } else {
        await navigator.clipboard.writeText(this.getBoardToShare());
      }
      showNotification(intl.formatMessage(messages.copyMessage));
    } catch (err) {
      showNotification(intl.formatMessage(messages.failedToCopy));
      console.log(err.message);
    }
  };

  onScannableFocus = property => () => {
    if (!this.state[property]) {
      this.setState({ [property]: true });
    }
  };

  onScannableBlur = property => () => {
    if (this.state[property]) {
      this.setState({ [property]: false });
    }
  };

  onUserIconClick = () => {
    const { userData, isLocked, intl, history } = this.props;
    if (isLocked) {
      const userLock = intl.formatMessage(messages.userProfileLocked);
      this.props.showNotification(userLock);
    } else {
      if (userData.name && userData.email) {
        history.push('/settings/people');
      } else {
        history.push('/login-signup');
      }
    }
  };

  getBoardToShare = () => {
    const { board } = this.props;
    if (isCordova()) {
      return 'https://app.cboard.io/board/' + board.id;
    } else {
      return window.location.href;
    }
  };

  render() {
    const {
      className,
      intl,
      board,
      userData,
      title,
      disabled,
      isLocked,
      isScannerActive,
      onBackClick,
      onDeactivateScannerClick,
      onLockClick,
      onLockNotify
    } = this.props;

    const isPublic = board && board.isPublic;
    const isOwnBoard = board && board.email === userData.email;
    const isLogged = userData && userData.name && userData.email;

    return (
      <div className={classNames('Navbar', className)}>
        {isLocked && <h2 className="Navbar__title">{title}</h2>}
        <div className="Navbar__group Navbar__group--start">
          <div className={this.state.backButton ? 'scanner__focused' : ''}>
            <Scannable
              disabled={disabled}
              onFocus={this.onScannableFocus('backButton')}
              onBlur={this.onScannableBlur('backButton')}
            >
              <BackButton disabled={disabled} onClick={onBackClick} />
            </Scannable>
          </div>
          {isScannerActive && (
            <div
              className={
                this.state.deactivateScannerButton ? 'scanner__focused' : ''
              }
            >
              <Scannable
                onFocus={this.onScannableFocus('deactivateScannerButton')}
                onBlur={this.onScannableBlur('deactivateScannerButton')}
              >
                <IconButton
                  className="Navbar__deactivateScanner"
                  onClick={onDeactivateScannerClick}
                >
                  <ScannerDeactivateIcon />
                </IconButton>
              </Scannable>
            </div>
          )}
          {!isLocked && <HelpButton component={Link} to="/settings/help" />}
        </div>
        <div className="Navbar__group Navbar__group--end">
          {!isLocked && (
            <React.Fragment>
              <PrintBoardButton />
              {!isMobile.any && <FullScreenButton />}
              {isLogged && !isCordova() && (
                <AnalyticsButton component={Link} to="/analytics" />
              )}
              <SettingsButton component={Link} to="/settings" />
              <BoardShare
                label={intl.formatMessage(messages.share)}
                intl={this.props.intl}
                isPublic={isPublic}
                isOwnBoard={isOwnBoard}
                isLogged={isLogged}
                onShareClick={this.onShareClick}
                onShareClose={this.onShareClose}
                publishBoard={this.publishBoard}
                onCopyLink={this.handleCopyLink}
                open={this.state.openShareDialog}
                url={this.getBoardToShare()}
                fullScreen={false}
              />
            </React.Fragment>
          )}
          <div className={'personal__account'}>
            <UserIcon onClick={this.onUserIconClick} />
          </div>
          <div className={'open__lock'}>
            <LockToggle
              locked={isLocked}
              onLockTick={onLockNotify}
              onClick={onLockClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Bar title
   */
  title: PropTypes.string,
  /**
   * If disabled, navigation is disabled
   */
  disabled: PropTypes.bool,
  /**
   * If enabled, navigation bar is locked Todo: shouldn't be here - mixing concerns
   */
  isLocked: PropTypes.bool,
  /**
   * Callback fired when clicking on back button
   */
  onBackClick: PropTypes.func,
  /**
   * Callback fired when clicking on lock button
   */
  onLockClick: PropTypes.func,
  isScannerActive: PropTypes.bool,
  onDeactivateScannerClick: PropTypes.func,
  history: PropTypes.object.isRequired
};

export default withRouter(injectIntl(Navbar));
