import themeProviderContainer from '../ThemeProvider.container';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

jest.mock('react-redux');

function Child() {
  return <p className="sub">Sub</p>;
}

describe('container group Test', () => {
  let instance;
  const props = {
    dir: '.',
    children: <Child />
  };
  beforeEach(() => {
    instance = shallow(
      <themeProviderContainer.reactComponent {...props} />
    ).instance();
  });
  it('themeProviderContainer: snapshot test', () => {
    const snapshot = renderer
      .create(<themeProviderContainer.reactComponent {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
