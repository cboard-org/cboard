/**
*
* LocaleToggle
*
*/

import React from 'react';

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
    <select className="toggle" value={props.value} onChange={props.onToggle}>
      {content}
    </select>
  );
}

Toggle.propTypes = {
  onToggle: React.PropTypes.func,
  options: React.PropTypes.array,
  value: React.PropTypes.string,
  messages: React.PropTypes.object,
};

export default Toggle;
