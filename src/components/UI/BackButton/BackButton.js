import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import IconButton from '../IconButton';
import messages from './BackButton.messages';
import { Scannable } from 'react-scannable';

const propTypes = {
  /**
   * If true, back button is disabled
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * @ignore
   */
  theme: PropTypes.object.isRequired,
  /**
   * Callback fired when back button is clicked
   */
  onClick: PropTypes.func.isRequired
};

class BackButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false
    };
  }

  onScannableFocus = () => {
    if (!this.state.isFocused) {
      this.setState({ isFocused: true });
    }
  };

  onScannableBlur = () => {
    if (this.state.isFocused) {
      this.setState({ isFocused: false });
    }
  };

  render(props) {
    const { intl, theme, disabled, ...rest } = this.props;
    const label = intl.formatMessage(messages.back);

    return (
      <div className={this.state.isFocused ? 'scanner__focused' : ''}>
        <Scannable
          disabled={disabled}
          onFocus={this.onScannableFocus}
          onBlur={this.onScannableBlur}
        >
          <IconButton label={label} disabled={disabled} {...rest}>
            {theme.direction === 'ltr' ? (
              <ArrowBackIcon />
            ) : (
              <ArrowForwardIcon />
            )}
          </IconButton>
        </Scannable>
      </div>
    );
  }
}

BackButton.propTypes = propTypes;

export default withStyles(null, { withTheme: true })(injectIntl(BackButton));
