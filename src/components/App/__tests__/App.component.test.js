import React from 'react';
import { shallow } from 'enzyme';

import App from '../App.component';

jest.mock('../App.messages', () => ({
  save: {
    id: 'cboard.components.App.save',
    defaultMessage: 'Save'
  },
  newContentAvailable: {
    id: 'cboard.components.App.newContentAvailable',
    defaultMessage: 'New content is available; please refresh.'
  },
  contentIsCached: {
    id: 'cboard.components.App.contentIsCached',
    defaultMessage: 'Content is cached for offline use.'
  }
}));

describe('App component tests', () => {
  const props = {
    dir: '/',
    isFirstVisit: true,
    isLogged: true,
    lang: 'es-ES',
    logout: () => {},
    user: {}
  };

  it('renders without crashing', () => {
    shallow(<App {...props} />);
  });
  it('Matches Snapshot', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
