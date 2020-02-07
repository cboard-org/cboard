import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import isMobile from 'ismobilejs';
import copy from 'copy-to-clipboard';
import { Scannable } from 'react-scannable';
import { IconButton } from '@material-ui/core';
import ScannerDeactivateIcon from '@material-ui/icons/ExploreOff';

import BoardShare from '../BoardShare';
import FullScreenButton from '../../UI/FullScreenButton';
import PrintBoardButton from '../../UI/PrintBoardButton';
import UserIcon from '../../UI/UserIcon';
import LockToggle from '../../UI/LockToggle';
import BackButton from '../../UI/BackButton';
import SettingsButton from '../../UI/SettingsButton';
import messages from '../Board.messages';
import { isCordova } from '../../../cordova-util';
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
    let nativeShare = false;
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#Examples
    if (
      this.props.board &&
      this.props.board.isPublic &&
      window &&
      window.navigator &&
      window.navigator.share
    ) {
      try {
        window.navigator.share({
          title: this.props.board.name,
          text: this.props.board.name,
          url: window.location.href
        });
        nativeShare = true;
      } catch (e) {}
    }

    if (!nativeShare) {
      this.setState({ openShareDialog: true });
    }
  };

  onShareClose = () => {
    this.setState({ openShareDialog: false });
  };

  publishBoard = () => {
    this.props.publishBoard();
  };

  copyLinkAction = () => {
    copy(window.location.href);
    const copyMessage = this.props.intl.formatMessage(messages.copyMessage);

    this.props.showNotification(copyMessage);
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
    const userLock = this.props.intl.formatMessage(messages.userProfileLocked);
    this.props.showNotification(userLock);
  };

  getBoardToShare = () => {
    const { board } = this.props;
    if (isCordova) {
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
        </div>
        <div className="Navbar__group Navbar__group--end">
          {!isLocked && (
            <React.Fragment>
              <PrintBoardButton />
              {!isMobile.any && <FullScreenButton />}
              <SettingsButton component={Link} to="/settings" />
              <BoardShare
                label={intl.formatMessage(messages.share)}
                intl={this.props.intl}
                isPublic={isPublic}
                isOwnBoard={isOwnBoard}
                onShareClick={this.onShareClick}
                onShareClose={this.onShareClose}
                publishBoard={this.publishBoard}
                copyLinkAction={this.copyLinkAction}
                open={this.state.openShareDialog}
                url={this.getBoardToShare()}
              />
            </React.Fragment>
          )}
          {!isLocked && 'name' in userData && 'email' in userData ? (
            <UserIcon component={Link} to="/settings/people" />
          ) : (
            <UserIcon onClick={this.onUserIconClick} />
          )}
          <LockToggle
            locked={isLocked}
            onLockTick={onLockNotify}
            onClick={onLockClick}
          />
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
  onDeactivateScannerClick: PropTypes.func
};

export default injectIntl(Navbar);
