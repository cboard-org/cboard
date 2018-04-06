import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import LockOutlineIcon from 'material-ui-icons/LockOutline';
import LockOpenIcon from 'material-ui-icons/LockOpen';

import IconButton from '../IconButton';
import messages from './LockButton.messages';

const propTypes = {
  intl: intlShape.isRequired,
  isLocked: PropTypes.bool,
  onNotify: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

class LockButton extends PureComponent {
  state = {
    clicks: 0
  };

  timeout = 0;

  clearClicksTimeout(ms) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.setState({ clicks: 0 });
    }, ms);
  }

  handleClick = () => {
    // TODO: refactor toggle behaviour into HOC
    const { intl, isLocked, onNotify, onClick } = this.props;
    const maxClicks = 4;

    if (!isLocked) {
      onClick();
      return;
    }

    if (this.state.clicks === 2) {
      onNotify(
        `${maxClicks - this.state.clicks} ${intl.formatMessage(
          messages.clicksToUnlock
        )}`
      );
    }

    if (this.state.clicks === maxClicks) {
      this.setState({ clicks: 0 });
      onClick();
      return;
    }

    this.setState(prevState => ({
      clicks: prevState.clicks + 1
    }));

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

LockButton.propTypes = propTypes;

export default injectIntl(LockButton);
