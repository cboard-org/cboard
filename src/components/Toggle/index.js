/**
*
* LocaleToggle
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import ToggleOption from '../ToggleOption';

function Toggle(props) {
  let content = (<option>--</option>);

  // If we have items, render them
  if (props.options) {
    content = props.options.map((option, index) => (
      <ToggleOption key={index} value={option.value} text={option.text} />
    ));
  }

  return (
    <select className="mdc-select" value={props.value} onChange={props.onToggle}>
      {content}
    </select>
  );
}

Toggle.propTypes = {
  onToggle: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string,
  messages: PropTypes.object,
};

export default Toggle;
