import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import LockOutlineIcon from '@material-ui/icons/LockOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import IconButton from '../IconButton';
import messages from './LockButton.messages';

class LockButton extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    isLocked: PropTypes.bool,
    maxClicks: PropTypes.number,
    onNotify: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    maxClicks: 4
  };

  clicks = 0;
  timeout = 0;

  clearClicksTimeout(ms) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.clicks = 0;
    }, ms);
  }

  handleClick = () => {
    // TODO: refactor into smaller functions
    const { intl, maxClicks, isLocked, onNotify, onClick } = this.props;

    this.clicks = this.clicks + 1;

    if (!isLocked) {
      this.clicks = 0;
      onClick();
      return;
    }

    if (this.clicks === 2) {
      onNotify(
        `${maxClicks - this.clicks} ${intl.formatMessage(
          messages.clicksToUnlock
        )}`
      );
    }

    if (this.clicks === maxClicks) {
      this.clicks = 0;
      onClick();
      return;
    }

    this.clearClicksTimeout(5000);
  };

  render() {
    const { intl, isLocked } = this.props;

    return (
      <IconButton
        label={
          isLocked
            ? intl.formatMessage(messages.unlock)
            : intl.formatMessage(messages.lock)
        }
        onClick={this.handleClick}
      >
        {isLocked ? <LockOutlineIcon /> : <LockOpenIcon />}
      </IconButton>
    );
  }
}

export default injectIntl(LockButton);
