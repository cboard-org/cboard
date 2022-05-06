import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import keycode from 'keycode';
import shortid from 'shortid';
import messages from '../Board.messages';
import { showNotification } from '../../Notifications/Notifications.actions';
import { isAndroid } from '../../../cordova-util';

import {
  cancelSpeech,
  speak
} from '../../../providers/SpeechProvider/SpeechProvider.actions';

import { changeOutput, clickOutput, changeLiveMode } from '../Board.actions';
import SymbolOutput from './SymbolOutput';

function translateOutput(output, intl) {
  const translatedOutput = output.map(value => {
    let translatedValue = { ...value };

    if (value.labelKey && intl.messages[value.labelKey]) {
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
    clickOutput: PropTypes.func.isRequired,
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
    const { changeOutput, isLiveMode } = this.props;
    const output = [];
    isLiveMode ? this.addLiveOutputTileClearOutput() : changeOutput(output);
  }

  popOutput() {
    const { changeOutput, isLiveMode } = this.props;
    const output = [...this.props.output];
    output.pop();
    isLiveMode && output.length === 0
      ? this.addLiveOutputTileClearOutput()
      : changeOutput(output);
  }

  spliceOutput(index) {
    const { changeOutput, isLiveMode } = this.props;
    const output = [...this.props.output];
    output.splice(index, 1);
    isLiveMode && output.length === 0
      ? this.addLiveOutputTileClearOutput()
      : changeOutput(output);
  }
  async speakOutput(text) {
    this.props.clickOutput(text.trim());
    return new Promise(resolve => {
      const { cancelSpeech, speak } = this.props;

      const onend = () => {
        resolve();
      };

      cancelSpeech();
      speak(text, onend);
    });
  }

  groupOutputByType() {
    const outputFrames = [[]];

    this.state.translatedOutput.forEach((value, index, arr) => {
      const prevValue = index ? arr[index - 1] : arr[0];
      let frame;

      if (Boolean(value.sound) !== Boolean(prevValue.sound)) {
        frame = [];
        outputFrames.push(frame);
      } else {
        frame = outputFrames[outputFrames.length - 1];
      }

      frame.push(value);
    });

    return outputFrames;
  }

  playAudio(src) {
    return new Promise((resolve, reject) => {
      let audio = new Audio();

      audio.onended = () => {
        resolve();
      };

      audio.src = src;
      audio.play();
    });
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async play(liveText = '') {
    if (liveText) {
      await this.speakOutput(liveText);
    } else {
      const outputFrames = this.groupOutputByType();

      await this.asyncForEach(outputFrames, async frame => {
        if (!frame[0]?.sound) {
          const text = frame.reduce(this.outputReducer, '');
          await this.speakOutput(text);
        } else {
          await new Promise(resolve => {
            this.asyncForEach(frame, async ({ sound }, index) => {
              await this.playAudio(sound);

              if (frame.length - 1 === index) {
                resolve();
              }
            });
          });
        }
      });
    }
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

  handlePhraseToShare = () => {
    if (this.props.output.length) {
      const labels = this.props.output.map(symbol => symbol.label);
      return labels.join(' ');
    }
    return '';
  };

  handleCopyClick = async () => {
    const { intl, showNotification } = this.props;
    const labels = this.props.output.map(symbol => symbol.label);
    try {
      if (isAndroid()) {
        await window.cordova.plugins.clipboard.copy(labels.join(' '));
      } else {
        await navigator.clipboard.writeText(labels.join(' '));
      }
      showNotification(intl.formatMessage(messages.copyMessage));
    } catch (err) {
      showNotification(intl.formatMessage(messages.failedToCopy));
      console.log(err.message);
    }
  };

  handleRemoveClick = index => event => {
    const { cancelSpeech } = this.props;
    cancelSpeech();
    this.spliceOutput(index);
  };

  handleOutputClick = event => {
    const targetEl = event.target;
    if (targetEl.tagName.toLowerCase() === 'div') {
      this.play();
    }
  };

  handleOutputKeyDown = event => {
    if (event.keyCode === keycode('enter')) {
      const targetEl = event.target;
      if (targetEl.tagName.toLowerCase() === 'div') {
        this.play();
      } else if (targetEl.tagName.toLowerCase() === 'textarea') {
        this.play(event.target.value);
        this.addLiveOutputTile();
      }
    }
  };

  defaultLiveTile = {
    backgroundColor: 'rgb(255, 241, 118)',
    image: '',
    label: '',
    labelKey: '',
    type: 'live'
  };

  addLiveOutputTile() {
    const { changeOutput } = this.props;
    this.defaultLiveTile.id = shortid.generate();
    changeOutput([...this.state.translatedOutput, this.defaultLiveTile]);
  }

  addLiveOutputTileClearOutput() {
    const { changeOutput } = this.props;
    this.setState({ translatedOutput: [] });
    this.defaultLiveTile.id = shortid.generate();
    changeOutput([this.defaultLiveTile]);
  }

  handleSwitchLiveMode = event => {
    const { changeLiveMode, isLiveMode } = this.props;

    if (!isLiveMode) {
      this.addLiveOutputTile();
    }
    changeLiveMode();
  };

  handleWriteSymbol = index => event => {
    const { changeOutput, intl } = this.props;
    const output = [...this.props.output];
    const newEl = {
      ...output[index],
      label: event.target.value
    };
    output.splice(index, 1, newEl);
    changeOutput(output);
    const translated = translateOutput(output, intl);
    this.setState({ translatedOutput: translated });
  };

  render() {
    const {
      output,
      navigationSettings,
      isLiveMode,
      increaseOutputButtons
    } = this.props;
    const tabIndex = output.length ? '0' : '-1';
    return (
      <SymbolOutput
        onBackspaceClick={this.handleBackspaceClick}
        onClearClick={this.handleClearClick}
        onCopyClick={this.handleCopyClick}
        onRemoveClick={this.handleRemoveClick}
        onClick={this.handleOutputClick}
        onKeyDown={this.handleOutputKeyDown}
        onSwitchLiveMode={this.handleSwitchLiveMode}
        symbols={this.state.translatedOutput}
        isLiveMode={isLiveMode}
        tabIndex={tabIndex}
        navigationSettings={navigationSettings}
        increaseOutputButtons={increaseOutputButtons}
        phrase={this.handlePhraseToShare()}
        onWriteSymbol={this.handleWriteSymbol}
      />
    );
  }
}

const mapStateToProps = ({ board, app }) => {
  return {
    output: board.output,
    isLiveMode: board.isLiveMode,
    navigationSettings: app.navigationSettings,
    increaseOutputButtons: app.displaySettings.increaseOutputButtons
  };
};

const mapDispatchToProps = {
  cancelSpeech,
  changeOutput,
  clickOutput,
  speak,
  showNotification,
  changeLiveMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(OutputContainer));
