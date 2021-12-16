import React from 'react';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * The callback function trigered when the switch change value. The value change and then the switch change position.
   */
  onChange: PropTypes.func.isRequired
};

function SwitchWithEnter(props) {
  const onKeyUp = event => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      props.onChange();
    }
  };

  return (
    <div onKeyUp={onKeyUp}>
      <Switch {...props} />
    </div>
  );
}

SwitchWithEnter.propTypes = propTypes;

export default SwitchWithEnter;
