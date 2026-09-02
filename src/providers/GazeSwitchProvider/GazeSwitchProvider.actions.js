import { UPDATE_GAZE_SWITCH_SETTINGS } from './GazeSwitchProvider.constants';

export function updateGazeSwitchSettings(payload) {
  return {
    type: UPDATE_GAZE_SWITCH_SETTINGS,
    payload
  };
}
