import languageProviderContainer from '../LanguageProvider.container';
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
    lang: 'es-ES',
    platformLangs: [],
    children: <Child />,
    setLangs: jest.fn(),
    changeLang: jest.fn()
  };
  beforeEach(() => {
    instance = shallow(
      <languageProviderContainer.reactComponent {...props} />
    ).instance();
  });
  it('languageProviderContainer: snapshot test', () => {
    const snapshot = renderer
      .create(<languageProviderContainer.reactComponent {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
