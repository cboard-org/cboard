
import speechProviderContainer from '../SpeechProvider.container';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

jest.mock('react-redux');

describe('container group Test', () => {
  const props = {
    voices: [],
    langs: [],
    children: {},
    getVoices: jest.fn()
  };
  it('speechProviderContainer: snapshot test', () => {
    const snapshot = renderer.create(<speechProviderContainer.reactComponent {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
