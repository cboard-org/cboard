import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import Information from './Information';

jest.mock('./Information.messages', () => {
  return {
    heading: {
      id: 'cboard.components.WelcomeScreenInformation.heading',
      defaultMessage: 'Welcome to Cboard'
    },
    text: {
      id: 'cboard.components.WelcomeScreenInformation.text',
      defaultMessage:
        'Cboard helps users with speech and language impairments to communicate with symbols and text-to-speech.'
    }
  };
});

describe('Information tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Information />);
  });
});
