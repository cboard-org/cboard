import {
  ACTIVATE_SCANNER,
  DEACTIVATE_SCANNER,
  TOGGLE_SCANNER,
  UPDATE_SCANNER_SETTINGS
} from './ScannerProvider.constants';

export function activateScanner() {
  return { type: ACTIVATE_SCANNER };
}

export function deactivateScanner() {
  return { type: DEACTIVATE_SCANNER };
}

export function toggleScanner() {
  return { type: TOGGLE_SCANNER };
}

export function updateScannerSettings(payload = {}) {
  return { type: UPDATE_SCANNER_SETTINGS, payload };
}
