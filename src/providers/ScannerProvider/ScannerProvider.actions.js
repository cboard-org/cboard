import {
  ACTIVATE_SCANNER,
  DEACTIVATE_SCANNER,
  TOGGLE_SCANNER
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
