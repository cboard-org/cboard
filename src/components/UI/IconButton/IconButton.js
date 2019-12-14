import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import MUIIconButton from '@material-ui/core/IconButton';

const propTypes = {
  /**
   *
   */
  children: PropTypes.node.isRequired,
  /**
   *
   */
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.string
  ]),
  /**
   *
   */
  disabled: PropTypes.bool,
  /**
   *
   */
  label: PropTypes.string.isRequired,
  /**
   *
   */
  onClick: PropTypes.func,
  /**
   *
   */
  to: PropTypes.string
};

function IconButton({ children, component, to, label, disabled, onClick }) {
  const child = React.Children.only(children);

  const iconButtonProps = {
    component,
    disabled,
    onClick,
    to,
    'aria-label': label,
    color: 'inherit'
  };

  const disableIconButtondStyle = {
    color: 'rgba(255, 255, 255, 0.26)'
  };

  return (
    <Fragment>
      {disabled ? (
        <MUIIconButton {...iconButtonProps} style={disableIconButtondStyle}>
          {child}
        </MUIIconButton>
      ) : (
        <Tooltip placement="bottom" title={label}>
          <MUIIconButton {...iconButtonProps}>{child}</MUIIconButton>
        </Tooltip>
      )}
    </Fragment>
  );
}

IconButton.propTypes = propTypes;

export default IconButton;
