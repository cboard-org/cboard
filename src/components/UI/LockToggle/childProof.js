import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

function withChildProof(WrappedComponent) {
  return class extends PureComponent {
    static propTypes = {
      /**
       * Maximum clicks to unlock
       */
      maxCount: PropTypes.number,
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
      maxCount: 4,
      onLockTick: () => {}
    };

    count = 0;
    isLocked = true;

    lock() {
      this.isLocked = true;
    }

    unLock() {
      this.isLocked = false;
    }

    incrementCount() {
      this.count = this.count + 1;
    }

    resetCount() {
      this.count = 0;
    }

    tickLock(onLockUnlock, onTick) {
      if (typeof onLockUnlock !== 'function') {
        throw new TypeError('onLockUnlock must be a function');
      }

      const { maxCount } = this.props;

      this.incrementCount();

      if (this.count < maxCount) {
        const clicksToUnlock = maxCount - this.count;
        onTick(clicksToUnlock);
      }

      if (this.count === maxCount) {
        this.unLock();
        onLockUnlock();
      }

      if (this.count === maxCount + 1) {
        this.resetCount();
        this.lock();
        onLockUnlock();
      }
    }

    handleClick = event => {
      const { onClick, onLockTick } = this.props;

      this.tickLock(() => {
        onClick(event);
      }, onLockTick);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          onClick={this.handleClick}
          locked={this.isLocked}
        />
      );
    }
  };
}

export default withChildProof;
