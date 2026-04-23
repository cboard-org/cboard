import {
  ADD_COMMUNICATION_ENTRY,
  CLEAR_COMMUNICATION_HISTORY,
  LOAD_COMMUNICATION_HISTORY,
  DELETE_COMMUNICATION_ENTRY,
  EXPORT_COMMUNICATION_HISTORY_SUCCESS,
  EXPORT_COMMUNICATION_HISTORY_FAILURE,
  EXPORT_COMMUNICATION_HISTORY_STARTED
} from './CommunicationHistory.constants';
import { LOGOUT } from '../Account/Login/Login.constants';

const initialState = {
  entries: [],
  isExporting: false,
  exportError: null,
  lastExport: null
};

export default function communicationHistoryReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case ADD_COMMUNICATION_ENTRY:
      return {
        ...state,
        entries: [...state.entries, action.entry]
      };

    case CLEAR_COMMUNICATION_HISTORY:
      if (action.userId) {
        return {
          ...state,
          entries: state.entries.filter(entry => entry.userId !== action.userId)
        };
      }
      return {
        ...state,
        entries: []
      };

    case LOAD_COMMUNICATION_HISTORY:
      return {
        ...state,
        entries: action.history
      };

    case DELETE_COMMUNICATION_ENTRY:
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.entryId)
      };

    case EXPORT_COMMUNICATION_HISTORY_STARTED:
      return {
        ...state,
        isExporting: true,
        exportError: null
      };

    case EXPORT_COMMUNICATION_HISTORY_SUCCESS:
      return {
        ...state,
        isExporting: false,
        lastExport: new Date().toISOString()
      };

    case EXPORT_COMMUNICATION_HISTORY_FAILURE:
      return {
        ...state,
        isExporting: false,
        exportError: action.error
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
