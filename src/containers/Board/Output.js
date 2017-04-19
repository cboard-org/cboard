import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const backspaceIcon = <FontIcon className="material-icons">backspace</FontIcon>;
const clearIcon = <FontIcon className="material-icons">clear</FontIcon>;
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
          <FlatButton
            icon={clearIcon}
            style={style}
            onClick={this.onClearClick}
          />}
        <FlatButton
          icon={backspaceIcon}
          style={style}
          onClick={this.onBackspaceClick}
        />
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
