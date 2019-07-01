import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { shallowMatchSnapshot } from '../../../common/test_utils';
import VoiceRecorder from '../VoiceRecorder.component';

const props = {
  src: 'string',
  onChange: jest.fn(),
  onClick: jest.fn(),
  user: { email: 'test@qa.com' }
};

describe('VoiceRecorder tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<VoiceRecorder onChange={() => {}} />);
  });
});
