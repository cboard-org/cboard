import '@material/button/dist/mdc.button.css'

import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';

const baseClasses = {
  'mdc-button': true
}

class Button extends PureComponent {

  render() {
    const {
      className,
      children,

      compact,
      primary,
      accent,
      raised,
      dense,

      ...props
    } = this.props

    const classes = classnames(baseClasses, {
      'mdc-button--compact': compact,
      'mdc-button--primary': primary,
      'mdc-button--accent': accent,
      'mdc-button--raised': raised,
      'mdc-button--dense': dense
    }, className)

    return (
      <button {...props} className={classes}>
        {children}
      </button>
    )
  }
}

Button.PropTypes = {
  className: PropTypes.string,
  compact: PropTypes.bool,
  primary: PropTypes.bool,
  accent: PropTypes.bool,
  raised: PropTypes.bool,
  dense: PropTypes.bool
}

export default Button