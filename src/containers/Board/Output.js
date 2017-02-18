import React from 'react';
import { FormattedMessage } from 'react-intl';

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
                  {value.img && <img className="value__image" src={value.img} />}
                </div>
                <span className="value__label"><FormattedMessage id={value.label} /></span>
              </div>
            ))}

          </div>
        </div>
        { !!this.state.output.length && <button className="mdc-button" onClick={this.onClearClick}><i className="material-icons">clear</i></button>}
        <button className="mdc-button" onClick={this.onBackspaceClick} disabled={!this.state.output.length}><i className="material-icons">backspace</i></button>
      </div>
    )
  }
}

Output.propTypes = {
  onOutputClick: React.PropTypes.func,
  value: React.PropTypes.object.isRequired
};

Output.defaultProps = {
};

export default Output;
