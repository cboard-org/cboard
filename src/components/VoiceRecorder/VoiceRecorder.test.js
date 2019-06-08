import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import VoiceRecorder from './VoiceRecorder.component';

describe('VoiceRecorder tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<VoiceRecorder onChange={() => {}} />);
  });
});
