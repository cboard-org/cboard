export const SCANNING_METHOD_AUTOMATIC = 'automatic';
export const SCANNING_METHOD_MANUAL = 'manual';

export const EYE_CONTROL_DWELL_OPTIONS = [300, 400, 500, 700, 1000];

// Higher blendshape threshold = eyes must close more fully = lower sensitivity.
export const EYE_CONTROL_SENSITIVITY_OPTIONS = [
  { value: 0.65, label: 'eyeControlSensitivityLow' },
  { value: 0.5, label: 'eyeControlSensitivityMedium' },
  { value: 0.35, label: 'eyeControlSensitivityHigh' }
];
