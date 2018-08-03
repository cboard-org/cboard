import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import './Scroll.css';

const invertDir = dir => (dir === 'rtl' ? 'ltr' : 'rtl');

export class Scroll extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    theme: PropTypes.object
  };

  render() {
    const {
      children,
      style,
      theme: { direction },
      ...other
    } = this.props;

    const scrollStyle = { direction: invertDir(direction) };

    return (
      <div className="Scroll" style={scrollStyle}>
        <div
          className="Scroll__container"
          style={{ ...style, direction }}
          {...other}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default withStyles(null, { withTheme: true })(Scroll);
