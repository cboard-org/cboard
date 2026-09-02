import { UPDATE_GAZE_SWITCH_SETTINGS } from './GazeSwitchProvider.constants';

const initialState = {
  // Master toggle for the eye-tracking (gaze-as-switch) feature.
  active: false,
  // Blendshape score threshold for "eye closed" (0..1).
  blinkThreshold: 0.5,
  // Sustained eyes-closed duration that counts as a switch (ms).
  dwellMs: 500,
  // Minimum time between activations (ms).
  cooldownMs: 900,
  // Show the small camera preview in the status widget.
  showPreview: true
};

export default function gazeSwitchProviderReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case UPDATE_GAZE_SWITCH_SETTINGS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
