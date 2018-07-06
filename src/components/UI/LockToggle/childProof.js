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

    count = 0;

    incrementCount() {
      this.count = this.count + 1;
    }

    resetCount() {
      this.count = 0;
    }

    debouncedResetCount = debounce(() => {
      console.log('reset');
      this.resetCount();
    }, 2000);

    tickLock(onToggle, onTick) {
      if (typeof onToggle !== 'function') {
        throw new TypeError('onToggle must be a function');
      }

      const { clicksToUnlock } = this.props;

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
