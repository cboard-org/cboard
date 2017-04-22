import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

const volumeUpIcon = <FontIcon className="material-icons">volume_up</FontIcon>;

class Keyboard extends PureComponent {
  render() {
    return (
      <div className="keyboard">
        <textarea ref={(ref) => { this.textarea = ref; }} placeholder="Type some text" />
        <RaisedButton
          label={this.props.intl.formatMessage({ id: 'cboard.containers.Text.speak' })}
          labelPosition="before"
          icon={volumeUpIcon}
          primary
          onTouchTap={(event) => { event.preventDefault(); this.props.speak(this.textarea.value); }}
        />
      </div>
    );
  }
}

Keyboard.propTypes = {
  intl: PropTypes.object.isRequired,
  speak: PropTypes.func.isRequired,
};

export default Keyboard;
