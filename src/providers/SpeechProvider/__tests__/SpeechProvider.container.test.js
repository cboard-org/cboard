
import speechProviderContainer from '../SpeechProvider.container';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

jest.mock('react-redux');

describe('container group Test', () => {
  let instance;
  const props = {
    voices: [],
    langs: [],
    children: {}
  };
  beforeEach(() => {
    instance = shallow(<speechProviderContainer.reactComponent {...props} />).instance();
  });
  it('speechProviderContainer: snapshot test', () => {
    const snapshot = renderer.create(<speechProviderContainer.reactComponent {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
