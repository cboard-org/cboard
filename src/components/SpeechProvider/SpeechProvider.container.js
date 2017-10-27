import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getVoices } from './SpeechProvider.actions';

export class SpeechProvider extends Component {
  static propTypes = {
    voices: PropTypes.array.isRequired,
    langs: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
  };

  componentWillMount() {
    this.props.getVoices();
  }

  render() {
    const { voices, children } = this.props;
    if (!voices) {
      return null;
    }

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  voices: state.speech.voices,
  langs: state.speech.langs
});

const mapDispatchToProps = dispatch => ({
  getVoices: () => {
    dispatch(getVoices());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeechProvider);
