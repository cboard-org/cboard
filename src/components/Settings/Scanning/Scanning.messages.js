import { defineMessages } from 'react-intl';

export default defineMessages({
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
  },
  scannerHowToDeactivate: {
    id: 'cboard.components.Settings.Scanning.scannerHowToDeactivate',
    defaultMessage: 'Press Escape 4 times to deactivate Scanner.'
  },
  scannerManualStrategy: {
    id: 'cboard.components.Settings.Scanning.scannerManualStrategy',
    defaultMessage:
      'Scanner advances with space bar key, press enter to select an item.'
  },
  scannerAutomaticStrategy: {
    id: 'cboard.components.Settings.Scanning.scannerAutomaticStrategy',
    defaultMessage:
      'Scanner will iterate over elements, press any key to select them.'
  }
});
