import { defineMessages } from 'react-intl';
import {
  DISPLAY_SIZE_STANDARD,
  DISPLAY_SIZE_LARGE,
  DISPLAY_SIZE_EXTRALARGE,
  LABEL_POSITION_ABOVE,
  LABEL_POSITION_BELOW,
  LABEL_POSITION_HIDDEN
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
  [LABEL_POSITION_ABOVE]: {
    id: 'cboard.components.Settings.Display.LabelPositionAbove',
    defaultMessage: 'Above'
  },
  [LABEL_POSITION_BELOW]: {
    id: 'cboard.components.Settings.Display.LabelPositionBelow',
    defaultMessage: 'Below'
  },
  [LABEL_POSITION_HIDDEN]: {
    id: 'cboard.components.Settings.Display.LabelPositionHidden',
    defaultMessage: 'Hidden'
  },
  uiSize: {
    id: 'cboard.components.Settings.Display.uiSize',
    defaultMessage: 'UI Size'
  },
  uiSizeSecondary: {
    id: 'cboard.components.Settings.Display.uiSizeSecondary',
    defaultMessage: 'Elements size'
  },
  fontFamily: {
    id: 'cboard.components.Settings.Display.fontFamily',
    defaultMessage: 'Font family'
  },
  fontFamilySecondary: {
    id: 'cboard.components.Settings.Display.fontFamilySecondary',
    defaultMessage: 'Change the text font used in the entire application'
  },
  fontSize: {
    id: 'cboard.components.Settings.Display.fontSize',
    defaultMessage: 'Font Size'
  },
  fontSizeSecondary: {
    id: 'cboard.components.Settings.Display.fontSizeSecondary',
    defaultMessage: 'App font size'
  },
  labelPosition: {
    id: 'cboard.components.Settings.Display.labelPosition',
    defaultMessage: 'Label Position'
  },
  labelPositionSecondary: {
    id: 'cboard.components.Settings.Display.labelPositionSecondary',
    defaultMessage:
      'Whether labels on tiles should be visible, or positioned above or below'
  },
  outputHide: {
    id: 'cboard.components.Settings.Display.outputHide',
    defaultMessage: 'Hide the output bar'
  },
  outputHideSecondary: {
    id: 'cboard.components.Settings.Display.outputHideSecondary',
    defaultMessage: 'Hides the white bar on the top where you build a sentence.'
  },
  outputIncreaseButtons: {
    id: 'cboard.components.Settings.Display.outputIncreaseButtons',
    defaultMessage: 'Increase the size of action buttons on the output bar'
  },
  outputIncreaseButtonsSecondary: {
    id: 'cboard.components.Settings.Display.outputIncreaseButtonsSecondary',
    defaultMessage:
      'Increase the size of the action buttons that are on the white bar where you build a sentence.'
  },
  darkTheme: {
    id: 'cboard.components.Settings.Display.darkTheme',
    defaultMessage: 'Enable dark theme'
  },
  darkThemeSecondary: {
    id: 'cboard.components.Settings.Display.darkThemeSecondary',
    defaultMessage:
      'The theme specifies the color of the components, darkness of the surfaces, level of shadow, appropriate opacity of ink elements, etc.'
  }
});
