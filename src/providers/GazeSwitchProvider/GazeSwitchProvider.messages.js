import { defineMessages } from 'react-intl';

export default defineMessages({
  eyeControl: {
    id: 'cboard.providers.GazeSwitchProvider.eyeControl',
    defaultMessage: 'Eye control'
  },
  loading: {
    id: 'cboard.providers.GazeSwitchProvider.loading',
    defaultMessage: 'Starting camera…'
  },
  ready: {
    id: 'cboard.providers.GazeSwitchProvider.ready',
    defaultMessage: 'Blink and hold to select'
  },
  noFace: {
    id: 'cboard.providers.GazeSwitchProvider.noFace',
    defaultMessage: 'Face not detected'
  },
  error: {
    id: 'cboard.providers.GazeSwitchProvider.error',
    defaultMessage: 'Camera unavailable'
  },
  scannerInactive: {
    id: 'cboard.providers.GazeSwitchProvider.scannerInactive',
    defaultMessage: 'Enable Scanning to make selections'
  }
});
