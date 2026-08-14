import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import VoiceRecorder from '../VoiceRecorder.component';

describe('VoiceRecorder tests', () => {
  const props = {
    src: 'string',
    onChange: jest.fn(),
    onClick: jest.fn(),
    user: { email: 'test@qa.com' }
  };

  test('default renderer', () => {
    shallowMatchSnapshot(<VoiceRecorder {...props} />);
  });
});
