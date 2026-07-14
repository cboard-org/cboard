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
import GrammarBar from './GrammarBar';

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
    // Check if output content has changed (not just length)
    const outputChanged = (() => {
      // Length change always means content changed
      if (props.output.length !== state.translatedOutput.length) {
        return true;
      }
      // Compare each tile's relevant properties to detect content changes
      for (let i = 0; i < props.output.length; i++) {
        const current = props.output[i];
        const previous = state.translatedOutput[i];
        // Compare key properties that affect translation/display
        if (
          !previous ||
          current.id !== previous.id ||
          current.label !== previous.label ||
          current.labelKey !== previous.labelKey ||
          current.vocalization !== previous.vocalization ||
          current.image !== previous.image ||
          current.type !== previous.type ||
          current.sound !== previous.sound
        ) {
          return true;
        }
      }
      return false;
    })();

    if (outputChanged) {
      const translatedOutput = translateOutput(props.output, props.intl);
      // Get inflectionOptions from the last non-live tile in output
      let lastTileIndex = props.output.length - 1;
      while (
        lastTileIndex >= 0 &&
        props.output[lastTileIndex] &&
        props.output[lastTileIndex].type === 'live'
      ) {
        lastTileIndex--;
      }
      // Only use the tile if we found a non-live tile (lastTileIndex >= 0)
      // If all tiles are live, lastTileIndex will be -1 and we should not use any tile
      const lastTile =
        lastTileIndex >= 0 && props.output[lastTileIndex]
          ? props.output[lastTileIndex]
          : null;

      // Filter out invalid options (missing required fields) before displaying
      const rawOptions =
        lastTile &&
        lastTile.inflectionOptions &&
        Array.isArray(lastTile.inflectionOptions) &&
        lastTile.inflectionOptions.length > 0
          ? lastTile.inflectionOptions
          : null;

      const inflectionOptions = rawOptions
        ? rawOptions.filter(
            option =>
              option.shorthandLabel &&
              option.shorthandLabel.trim() !== '' &&
              option.outputLabel &&
              option.outputLabel.trim() !== '' &&
              option.vocalization &&
              option.vocalization.trim() !== ''
          )
        : null;

      return {
        translatedOutput,
        inflectionOptions:
          inflectionOptions && inflectionOptions.length > 0
            ? inflectionOptions
            : null
      };
    } else {
      // Output length hasn't changed, check if inflectionOptions changed
      let lastTileIndex = props.output.length - 1;
      while (
        lastTileIndex >= 0 &&
        props.output[lastTileIndex] &&
        props.output[lastTileIndex].type === 'live'
      ) {
        lastTileIndex--;
      }
      // Only use the tile if we found a non-live tile (lastTileIndex >= 0)
      // If all tiles are live, lastTileIndex will be -1 and we should not use any tile
      const lastTile =
        lastTileIndex >= 0 && props.output[lastTileIndex]
          ? props.output[lastTileIndex]
          : null;
      // Filter out invalid options (missing required fields) before displaying
      const rawOptions =
        lastTile &&
        lastTile.inflectionOptions &&
        Array.isArray(lastTile.inflectionOptions) &&
        lastTile.inflectionOptions.length > 0
          ? lastTile.inflectionOptions
          : null;

      const currentInflectionOptions = rawOptions
        ? rawOptions.filter(
            option =>
              option.shorthandLabel &&
              option.shorthandLabel.trim() !== '' &&
              option.outputLabel &&
              option.outputLabel.trim() !== '' &&
              option.vocalization &&
              option.vocalization.trim() !== ''
          )
        : null;

      // Compare arrays by value, not by reference
      const inflectionOptionsChanged = (() => {
        const stateOptions = state.inflectionOptions;
        // Both null/undefined - same
        if (!currentInflectionOptions && !stateOptions) {
          return false;
        }
        // One is null, other is not - different
        if (!currentInflectionOptions || !stateOptions) {
          return true;
        }
        // Different lengths - different
        if (currentInflectionOptions.length !== stateOptions.length) {
          return true;
        }
        // Compare each option's properties
        for (let i = 0; i < currentInflectionOptions.length; i++) {
          const current = currentInflectionOptions[i];
          const stateOption = stateOptions[i];
          if (
            current.shorthandLabel !== stateOption.shorthandLabel ||
            current.outputLabel !== stateOption.outputLabel ||
            current.vocalization !== stateOption.vocalization ||
            current.sound !== stateOption.sound
          ) {
            return true;
          }
        }
        return false;
      })();

      if (inflectionOptionsChanged) {
        return { inflectionOptions: currentInflectionOptions };
      }
    }
    return null;
  }

  state = {
    translatedOutput: [],
    inflectionOptions: null
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleRepeatLastSpokenSentence);
  }
  componentWillUnmount() {
    document.removeEventListener(
      'keydown',
      this.handleRepeatLastSpokenSentence
    );
  }

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

      // Cleanup function to remove event listeners
      const cleanup = () => {
        if (audio) {
          audio.onended = null;
          audio.onerror = null;
          audio.onabort = null;
          audio.src = '';
          audio = null;
        }
      };

      // Set up success handler
      audio.onended = () => {
        cleanup();
        resolve();
      };

      // Set up error handlers
      audio.onerror = event => {
        // Capture error message before cleanup sets audio to null
        const errorMessage =
          (event.target && event.target.error && event.target.error.message) ||
          (audio && audio.error && audio.error.message) ||
          'Unknown error';
        cleanup();
        const error = new Error(`Audio playback failed: ${errorMessage}`);
        reject(error);
      };

      audio.onabort = () => {
        cleanup();
        reject(new Error('Audio playback was aborted'));
      };

      // Handle promise rejection from play()
      audio.src = src;
      audio
        .play()
        .then(() => {
          // Audio started playing successfully, wait for onended
        })
        .catch(error => {
          cleanup();
          reject(
            new Error(
              `Failed to play audio: ${error.message || 'Unknown error'}`
            )
          );
        });
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
          // Await asyncForEach to ensure all audio playback completes sequentially
          await this.asyncForEach(frame, async ({ sound }, index) => {
            try {
              await this.playAudio(sound);
            } catch (error) {
              console.error('Error playing audio:', error);
            }
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

  handleRepeatLastSpokenSentence = event => {
    const Z_KEY_CODE = 90;
    const Y_KEY_CODE = 89;
    const { output } = this.props;
    if (
      ((event.ctrlKey && event.shiftKey && event.keyCode === Z_KEY_CODE) ||
        (event.ctrlKey && event.keyCode === Y_KEY_CODE)) &&
      !!output.length
    ) {
      const isLastSpokenSymbol = (element, index) => {
        if (output.length === 1) return true;
        if (element.label) {
          return element.type === 'live' ? index < output.length - 1 : true;
        }
        return false;
      };

      const lastSpokenSymbol = output.findLast((element, index) =>
        isLastSpokenSymbol(element, index)
      );
      const text = lastSpokenSymbol ? lastSpokenSymbol.label : '';
      this.speakOutput(text);
    }
  };

  handleOutputClick = event => {
    const targetEl = event.target;
    const targetElLow = targetEl.tagName.toLowerCase();
    if (targetElLow === 'div' || targetElLow === 'p') {
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

  handleInflectionOptionClick = async option => {
    const { changeOutput, intl } = this.props;
    const output = [...this.props.output];

    if (output.length === 0) {
      return;
    }

    // Validate required fields before applying the inflection option
    if (!option.outputLabel || option.outputLabel.trim() === '') {
      console.warn('Cannot apply inflection option: outputLabel is required');
      return;
    }

    if (!option.vocalization || option.vocalization.trim() === '') {
      console.warn('Cannot apply inflection option: vocalization is required');
      return;
    }

    // Find the last non-live tile
    let lastIndex = output.length - 1;
    while (
      lastIndex >= 0 &&
      output[lastIndex] &&
      output[lastIndex].type === 'live'
    ) {
      lastIndex--;
    }

    // If all tiles are live, we cannot apply inflection to a live tile
    if (lastIndex < 0) {
      console.warn('Cannot apply inflection option: all tiles are live type');
      return;
    }

    const { inflectionOptions, ...tileWithoutInflectionOptions } = output[
      lastIndex
    ];
    const updatedTile = {
      ...tileWithoutInflectionOptions,
      label: option.outputLabel.trim(),
      vocalization: option.vocalization.trim(),
      sound:
        option.sound && option.sound.trim() !== ''
          ? option.sound
          : tileWithoutInflectionOptions.sound
    };

    output[lastIndex] = updatedTile;
    changeOutput(output);

    this.setState({ inflectionOptions: null });

    const translated = translateOutput(output, intl);
    this.setState({ translatedOutput: translated });

    const { cancelSpeech } = this.props;
    cancelSpeech();

    const outputFrames = this.groupOutputByTypeFromArray(translated);
    await this.asyncForEach(outputFrames, async frame => {
      if (!frame[0]?.sound) {
        const text = frame.reduce(this.outputReducer, '');
        await this.speakOutput(text);
      } else {
        // Await asyncForEach to ensure all audio playback completes sequentially
        await this.asyncForEach(frame, async ({ sound }, index) => {
          try {
            await this.playAudio(sound);
          } catch (error) {
            console.error('Error playing audio:', error);
          }
        });
      }
    });
  };

  groupOutputByTypeFromArray(outputArray) {
    const outputFrames = [[]];

    outputArray.forEach((value, index, arr) => {
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

  render() {
    const {
      output,
      navigationSettings,
      isLiveMode,
      increaseOutputButtons
    } = this.props;
    const tabIndex = output.length ? '0' : '-1';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: '1 1 auto', minHeight: 0 }}>
          <SymbolOutput
            onBackspaceClick={this.handleBackspaceClick}
            onClearClick={this.handleClearClick}
            onCopyClick={this.handleCopyClick}
            onRemoveClick={this.handleRemoveClick}
            onClick={isLiveMode ? undefined : this.handleOutputClick}
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
        </div>
        <GrammarBar
          inflectionOptions={this.state.inflectionOptions}
          onOptionClick={this.handleInflectionOptionClick}
        />
      </div>
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
