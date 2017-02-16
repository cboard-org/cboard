import React from 'react';

function Switch(props) {
  return (
    <div className="mdc-switch">
      <input className="mdc-switch__native-control" type="checkbox" onChange={props.onChange} />
      <div className="mdc-switch__background">
        <div className="mdc-switch__knob"></div>
      </div>
    </div>
  );
}

export default Switch;