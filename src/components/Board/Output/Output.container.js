import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import keycode from 'keycode';

import {
  cancelSpeech,
  speak
} from '../../../providers/SpeechProvider/SpeechProvider.actions';

import { changeOutput } from '../Board.actions';
import SymbolOutput from './SymbolOutput';

function translateOutput(output, intl) {
  const translatedOutput = output.map(value => {
    let translatedValue = { ...value };

    if (value.labelKey) {
      translatedValue.label = intl.formatMessage({ id: value.labelKey });
    }
    return translatedValue;
  });
  return translatedOutput;
}

export class OutputContainer extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape,
    /**
     * Array of symbols
     */
    output: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Image to display
         */
        image: PropTypes.string,
        /**
         * Label to display
         */
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
      })
    )
  };

  static getDerivedStateFromProps(props, state) {
    if (props.output.length !== state.translatedOutput.length) {
      const translatedOutput = translateOutput(props.output, props.intl);
      return { translatedOutput };
    }
    return null;
  }

  state = {
    translatedOutput: []
  };

  outputReducer(accumulator, currentValue) {
    const actionValue =
      currentValue.action &&
      currentValue.action.startsWith('+') &&
      currentValue.action.slice(1);

    const symbolValue = currentValue.vocalization || currentValue.label;
    const value = actionValue || ` ${symbolValue}`;

    return ` ${accumulator}${value}`;
  }

  clearOutput() {
    const { changeOutput } = this.props;
    const output = [];

    changeOutput(output);
  }

  popOutput() {
    const { changeOutput } = this.props;
    const output = [...this.props.output];
    output.pop();

    changeOutput(output);
  }

  speakOutput() {
    const { cancelSpeech, speak } = this.props;
    const reducedOutput = this.state.translatedOutput.reduce(
      this.outputReducer,
      ''
    );

    cancelSpeech();
    speak(reducedOutput);
  }

  handleBackspaceClick = () => {
    const { cancelSpeech } = this.props;
    cancelSpeech();
    this.popOutput();
  };

  handleClearClick = () => {
    const { cancelSpeech } = this.props;
    cancelSpeech();
    this.clearOutput();
  };

  handleOutputClick = () => {
    this.speakOutput();
  };

  handleOutputKeyDown = event => {
    if (event.keyCode === keycode('enter')) {
      this.speakOutput();
    }
  };

  render() {
    const { output } = this.props;

    const tabIndex = output.length ? '0' : '-1';

    return (
      <SymbolOutput
        onBackspaceClick={this.handleBackspaceClick}
        onClearClick={this.handleClearClick}
        onClick={this.handleOutputClick}
        onKeyDown={this.handleOutputKeyDown}
        symbols={this.state.translatedOutput}
        tabIndex={tabIndex}
      />
    );
  }
}

const mapStateToProps = ({ board }) => {
  return {
    output: board.output
  };
};

const mapDispatchToProps = {
  cancelSpeech,
  changeOutput,
  speak
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(OutputContainer));
