import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import IconButton from 'material-ui/IconButton';

const style = {
  width: 64,
  height: 64
};

require('../../styles/Output.css');

class Output extends React.Component {
  constructor(props) {
    super(props);

    this.state = { output: [] };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.addValue(nextProps.value);
    }
  }

  setOutput(output) {
    this.setState({ output });
  }

  addValue(value) {
    const output = this.state.output;
    output.push(value);
    this.setOutput(output);
  }

  removeValue() {
    const output = this.state.output;
    output.pop();
    this.setOutput(output);
  }

  clear() {
    this.setOutput([]);
  }

  onBackspaceClick = () => {
    this.removeValue();
  }

  onClearClick = () => {
    this.clear();
  }

  onOutputClick = () => {
    this.props.onOutputClick(this.state.output);
  }

  render() {
    return (
      <div className="output">
        <div className="output__values" onClick={this.onOutputClick}>
          <div className="values-wrap">

            {this.state.output.map((value, index) => (
              <div className="value" key={index}>
                <div className="value__symbol">
                  {value.img && <img className="value__image" src={value.img} alt="" />}
                </div>
                <span className="value__label"><FormattedMessage id={value.label} /></span>
              </div>
            ))}

          </div>
        </div>
        {!!this.state.output.length &&
        <IconButton
          iconClassName="material-icons"
          style={style} // todo
          onTouchTap={this.onClearClick}
        >
          clear
        </IconButton>}
        <IconButton
          iconClassName="material-icons"
          style={style} // todo
          onTouchTap={this.onBackspaceClick}
        >
          backspace
        </IconButton>
      </div>
    )
  }
}

Output.propTypes = {
  onOutputClick: PropTypes.func,
  value: PropTypes.object
};

Output.defaultProps = {
};

export default Output;
