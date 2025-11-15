import moment from 'moment';
import {
  ADD_COMMUNICATION_ENTRY,
  CLEAR_COMMUNICATION_HISTORY,
  LOAD_COMMUNICATION_HISTORY,
  DELETE_COMMUNICATION_ENTRY,
  EXPORT_COMMUNICATION_HISTORY_SUCCESS,
  EXPORT_COMMUNICATION_HISTORY_FAILURE,
  EXPORT_COMMUNICATION_HISTORY_STARTED,
  COMMUNICATION_ENTRY_TYPES
} from './CommunicationHistory.constants';

export function addCommunicationEntry(entry) {
  const enhancedEntry = {
    ...entry,
    id: `${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    timestamp: moment().toISOString(),
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    userId: entry.userId || null,
    sessionId: entry.sessionId || null
  };

  return {
    type: ADD_COMMUNICATION_ENTRY,
    entry: enhancedEntry
  };
}

export function clearCommunicationHistory(userId = null) {
  return {
    type: CLEAR_COMMUNICATION_HISTORY,
    userId
  };
}

export function loadCommunicationHistory(history) {
  return {
    type: LOAD_COMMUNICATION_HISTORY,
    history
  };
}

export function deleteCommunicationEntry(entryId) {
  return {
    type: DELETE_COMMUNICATION_ENTRY,
    entryId
  };
}

export function exportCommunicationHistoryStarted() {
  return {
    type: EXPORT_COMMUNICATION_HISTORY_STARTED
  };
}

export function exportCommunicationHistorySuccess() {
  return {
    type: EXPORT_COMMUNICATION_HISTORY_SUCCESS
  };
}

export function exportCommunicationHistoryFailure(error) {
  return {
    type: EXPORT_COMMUNICATION_HISTORY_FAILURE,
    error
  };
}

export function trackSymbolSelection(tile, userId = null, sessionId = null) {
  return dispatch => {
    const entry = {
      type: COMMUNICATION_ENTRY_TYPES.SYMBOL,
      label: tile.label || tile.labelKey || '',
      image: tile.image || null,
      backgroundColor: tile.backgroundColor || null,
      borderColor: tile.borderColor || null,
      userId,
      sessionId,
      metadata: {
        tileId: tile.id,
        boardId: tile.boardId || null,
        vocalization: tile.vocalization || tile.label || ''
      }
    };
    dispatch(addCommunicationEntry(entry));
  };
}

export function trackPhraseSpoken(output, userId = null, sessionId = null) {
  return dispatch => {
    const phrase = output.map(symbol => symbol.label || '').join(' ');
    const entry = {
      type: COMMUNICATION_ENTRY_TYPES.PHRASE,
      label: phrase,
      symbols: output,
      userId,
      sessionId,
      metadata: {
        symbolCount: output.length,
        hasImages: output.some(s => s.image)
      }
    };
    dispatch(addCommunicationEntry(entry));
  };
}

export function trackClearAction(userId = null, sessionId = null) {
  return dispatch => {
    const entry = {
      type: COMMUNICATION_ENTRY_TYPES.CLEAR,
      label: 'Clear',
      userId,
      sessionId
    };
    dispatch(addCommunicationEntry(entry));
  };
}

export function trackBackspaceAction(userId = null, sessionId = null) {
  return dispatch => {
    const entry = {
      type: COMMUNICATION_ENTRY_TYPES.BACKSPACE,
      label: 'Backspace',
      userId,
      sessionId
    };
    dispatch(addCommunicationEntry(entry));
  };
}
