import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import Display from './Display.component';

jest.mock('./Display.messages', () => {
  return {
    display: {
      id: 'cboard.components.Settings.Display.display',
      defaultMessage: 'Display'
    },
    Standard: {
      id: 'cboard.components.Settings.Display.StandardSize',
      defaultMessage: 'Standard'
    },
    Large: {
      id: 'cboard.components.Settings.Display.LargeSize',
      defaultMessage: 'Large'
    },
    Extralarge: {
      id: 'cboard.components.Settings.Display.ExtraLargeSize',
      defaultMessage: 'Extra Large'
    },
    boardElementsSize: {
      id: 'cboard.components.Settings.Display.boardElementsSize',
      defaultMessage: 'Board Elements Size'
    },
    boardElementsSizeSecondary: {
      id: 'cboard.components.Settings.Display.boardElementsSizeSecondary',
      defaultMessage: '...'
    },
    boardFontSize: {
      id: 'cboard.components.Settings.Display.boardFontSize',
      defaultMessage: 'Board Font Size'
    },
    boardFontSizeSecondary: {
      id: 'cboard.components.Settings.Display.boardFontSizeSecondary',
      defaultMessage: '...'
    },
    settingsSize: {
      id: 'cboard.components.Settings.Display.settingsSize',
      defaultMessage: 'Settings Size'
    },
    settingsSizeSecondary: {
      id: 'cboard.components.Settings.Display.settingsSizeSecondary',
      defaultMessage: '...'
    },
    pictogramSize: {
      id: 'cboard.components.Settings.Display.pictogramSize',
      defaultMessage: 'Pictograms Size'
    },
    pictogramSizeSecondary: {
      id: 'cboard.components.Settings.Display.pictogramSizeSecondary',
      defaultMessage: '...'
    }
  };
});

const COMPONENT_PROPS = {
  displaySettings: {},
  intl: {
    formatMessage: () => {}
  },
  onClose: () => {}
};

describe('Display tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Display {...COMPONENT_PROPS} />);
  });
});
