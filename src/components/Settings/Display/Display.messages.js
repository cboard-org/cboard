import { defineMessages } from 'react-intl';
import {
  DISPLAY_SIZE_STANDARD,
  DISPLAY_SIZE_LARGE,
  DISPLAY_SIZE_EXTRALARGE
} from './Display.constants';

export default defineMessages({
  display: {
    id: 'cboard.components.Settings.Display.display',
    defaultMessage: 'Display'
  },
  [DISPLAY_SIZE_STANDARD]: {
    id: 'cboard.components.Settings.Display.StandardSize',
    defaultMessage: 'Standard'
  },
  [DISPLAY_SIZE_LARGE]: {
    id: 'cboard.components.Settings.Display.LargeSize',
    defaultMessage: 'Large'
  },
  [DISPLAY_SIZE_EXTRALARGE]: {
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
});
