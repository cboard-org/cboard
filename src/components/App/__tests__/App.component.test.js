import React from 'react';
import { shallow } from 'enzyme';

import App from '../App.component';

jest.mock('../App.messages', () => {
  return {
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
  };
});
jest.mock('../../Settings/Scanning/Scanning.messages', () => {
  return {
    scanning: {
      id: 'cboard.components.Settings.Scanning.scanning',
      defaultMessage: 'Scanning'
    },
    enable: {
      id: 'cboard.components.Settings.Scanning.enable',
      defaultMessage: 'Enable'
    },
    enableSecondary: {
      id: 'cboard.components.Settings.Scanning.enableSecondary',
      defaultMessage: 'Start scanning boards immediately'
    },
    delay: {
      id: 'cboard.components.Settings.Scanning.delay',
      defaultMessage: 'Time delay'
    },
    delaySecondary: {
      id: 'cboard.components.Settings.Scanning.delaySecondary',
      defaultMessage: 'Time between two consecutive scanning highlights'
    },
    method: {
      id: 'cboard.components.Settings.Scanning.method',
      defaultMessage: 'Scan method'
    },
    methodSecondary: {
      id: 'cboard.components.Settings.Scanning.methodSecondary',
      defaultMessage: 'Method to be used for board exploration'
    },
    seconds: {
      id: 'cboard.components.Settings.Scanning.seconds',
      defaultMessage: '{value} seconds'
    },
    automatic: {
      id: 'cboard.components.Settings.Scanning.automatic',
      defaultMessage: 'Automatic'
    },
    manual: {
      id: 'cboard.components.Settings.Scanning.manual',
      defaultMessage: 'Manual'
    }
  };
});

describe('App component tests', () => {
  const props = {
    dir: '/',
    isFirstVisit: true,
    isLogged: true,
    lang: 'es-ES',
    logout: () => {},
    user: {},
    messages: {}
  };

  it('renders without crashing', () => {
    shallow(<App {...props} />);
  });
  it('Matches Snapshot', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
