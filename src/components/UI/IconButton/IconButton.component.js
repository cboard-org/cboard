import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import MUIIconButton from 'material-ui/IconButton';

const propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  component: PropTypes.func,
  to: PropTypes.string,
  onClick: PropTypes.func
};

function IconButton({ children, component, to, label, disabled, onClick }) {
  const child = React.Children.only(children);
  const iconButtonProps = {
    'aria-label': label,
    disabled,
    component,
    to,
    onClick,
    color: 'inherit'
  };
  return (
    <Fragment>
      {disabled ? (
        <MUIIconButton
          {...iconButtonProps}
          style={{
            color: 'rgba(255, 255, 255, 0.26)'
          }}
        >
          {child}
        </MUIIconButton>
      ) : (
        <Tooltip title={label} placement="bottom">
          <MUIIconButton {...iconButtonProps}>{child}</MUIIconButton>
        </Tooltip>
      )}
    </Fragment>
  );
}

IconButton.propTypes = propTypes;

export default IconButton;
