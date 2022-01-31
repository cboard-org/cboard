import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { DISPLAY_SIZE_STANDARD } from './Display.constants';
import Display from './Display.component';
import { DEFAULT_FONT_FAMILY } from '../../../providers/ThemeProvider/ThemeProvider.constants';

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
    uiSize: {
      id: 'cboard.components.Settings.Display.uiSize',
      defaultMessage: 'UI Size'
    },
    uiSizeSecondary: {
      id: 'cboard.components.Settings.Display.uiSizeSecondary',
      defaultMessage: 'Elements size'
    },
    fontSize: {
      id: 'cboard.components.Settings.Display.fontSize',
      defaultMessage: 'Font Size'
    },
    fontSizeSecondary: {
      id: 'cboard.components.Settings.Display.fontSizeSecondary',
      defaultMessage: 'App font size'
    }
  };
});

const COMPONENT_PROPS = {
  displaySettings: {
    uiSize: DISPLAY_SIZE_STANDARD,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DISPLAY_SIZE_STANDARD
  },
  intl: {
    formatMessage: msg => msg
  },
  onClose: () => {},
  updateDisplaySettings: jest.fn()
};

describe('Display tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Display {...COMPONENT_PROPS} />);
  });
});
