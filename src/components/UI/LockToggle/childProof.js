import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

function withChildProof(WrappedComponent) {
  return class extends PureComponent {
    static propTypes = {
      /**
       * Clicks to unlock, when number of clicks reached fires onClick
       */
      clicksToUnlock: PropTypes.number,
      /**
       * Callback fired on unlock and lock
       */
      onClick: PropTypes.func.isRequired,
      /**
       * Callback fired on each click
       */
      onLockTick: PropTypes.func
    };

    static defaultProps = {
      clicksToUnlock: 4,
      onLockTick: () => {}
    };

    lockActivated = true;
    count = 0;

    incrementCount() {
      this.count = this.count + 1;
    }

    resetCount() {
      this.count = 0;
    }

    debouncedResetCount = debounce(() => {
      this.resetCount();
    }, 2000);

    activateLock() {
      this.lockActivated = true;
    }

    deactivateLock() {
      this.lockActivated = false;
    }

    tickLock(onToggle, onTick) {
      const { clicksToUnlock, locked } = this.props;

      if (!this.lockActivated) {
        return;
      }

      if (!locked) {
        onToggle();
        this.activateLock();
        this.resetCount();
        return;
      }

      this.incrementCount();

      if (this.count < clicksToUnlock) {
        this.debouncedResetCount();
      } else {
        this.debouncedResetCount.cancel();
      }

      if (this.count <= clicksToUnlock) {
        const clicksLeft = clicksToUnlock - this.count;
        onTick(clicksLeft);
      }

      if (this.count === clicksToUnlock) {
        onToggle();
        this.deactivateLock();

        setTimeout(() => {
          this.activateLock();
        }, 1000);
      }

      if (this.count === clicksToUnlock + 1) {
        this.resetCount();
        onToggle();
      }
    }

    handleClick = event => {
      const { onClick, onLockTick } = this.props;

      this.tickLock(() => {
        onClick(event);
      }, onLockTick);
    };

    render() {
      return <WrappedComponent {...this.props} onClick={this.handleClick} />;
    }
  };
}

export default withChildProof;
