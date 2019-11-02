import { SpeechProvider } from '../SpeechProvider.container';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

jest.mock('react-redux');

describe('container group Test', () => {
  const props = {
    voices: [],
    langs: [],
    children: {},
    getVoices: async () => {
      return [];
    }
  };
  it('speechProviderContainer: snapshot test', () => {
    const snapshot = renderer
      .create(
        <SpeechProvider {...props}>
          <div>child one</div>
          <div>child two</div>
        </SpeechProvider>
      )
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
