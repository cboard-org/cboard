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
  },
  outputHide: {
    id: 'cboard.components.Settings.Navigation.outputHide',
    defaultMessage: 'Hide the output bar'
  },
  outputHideSecondary: {
    id: 'cboard.components.Settings.Navigation.outputHideSecondary',
    defaultMessage: 'Hides the white bar on the top where you build a sentence.'
  }
});
