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
  if (props.values) {
    content = props.values.map((value) => (
      <ToggleOption key={value} value={value} />
    ));
  }

  return (
    <select className="language-toggle" value={props.value} onChange={props.onToggle}>
      {content}
    </select>
  );
}

Toggle.propTypes = {
  onToggle: React.PropTypes.func,
  values: React.PropTypes.array,
  value: React.PropTypes.string,
  messages: React.PropTypes.object,
};

export default Toggle;
