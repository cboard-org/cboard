import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import '../styles/Keyboard.css';

const volumeUpIcon = <FontIcon className="material-icons">volume_up</FontIcon>;

class Keyboard extends PureComponent {
  render() {
    return (
      <div className="keyboard">
        <textarea
          className="keyboard__textarea"
          ref={(ref) => { this.textarea = ref; }}
          placeholder="Type some text"
        />
        <RaisedButton
          primary
          className="keyboard__speak-button"
          label={this.props.intl.formatMessage({ id: 'cboard.containers.Text.speak' })}
          labelPosition="before"
          icon={volumeUpIcon}
          onTouchTap={(event) => {
            event.preventDefault();
            this.props.onSpeak(this.textarea.value);
          }}
        />
      </div>
    );
  }
}

Keyboard.propTypes = {
  intl: PropTypes.object.isRequired,
  onSpeak: PropTypes.func.isRequired,
};

export default Keyboard;
