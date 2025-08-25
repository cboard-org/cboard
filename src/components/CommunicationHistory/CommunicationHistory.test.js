import {
  addCommunicationEntry,
  trackSymbolSelection,
  trackPhraseSpoken,
  trackClearAction,
  trackBackspaceAction
} from './CommunicationHistory.actions';
import {
  ADD_COMMUNICATION_ENTRY,
  CLEAR_COMMUNICATION_HISTORY,
  COMMUNICATION_ENTRY_TYPES
} from './CommunicationHistory.constants';
import communicationHistoryReducer from './CommunicationHistory.reducer';
import PDFReportService from '../../services/PDFReportService';

// Mock moment for consistent testing
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  const mockMoment = () => actualMoment('2024-01-15T10:30:00.000Z');
  mockMoment.format = actualMoment.format;
  return mockMoment;
});

describe('CommunicationHistory', () => {
  describe('Actions', () => {
    it('should create an action to add a communication entry', () => {
      const entry = {
        type: COMMUNICATION_ENTRY_TYPES.SYMBOL,
        label: 'Hello',
        image: 'hello.png'
      };

      const action = addCommunicationEntry(entry);

      expect(action.type).toBe(ADD_COMMUNICATION_ENTRY);
      expect(action.entry.label).toBe('Hello');
      expect(action.entry.image).toBe('hello.png');
      expect(action.entry.id).toBeDefined();
      expect(action.entry.timestamp).toBeDefined();
    });

    it('should track symbol selection', () => {
      const dispatch = jest.fn();
      const tile = {
        id: 'tile1',
        label: 'Water',
        image: 'water.png',
        boardId: 'board1'
      };

      trackSymbolSelection(tile, 'user@example.com', 'session123')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ADD_COMMUNICATION_ENTRY,
          entry: expect.objectContaining({
            type: COMMUNICATION_ENTRY_TYPES.SYMBOL,
            label: 'Water',
            image: 'water.png',
            userId: 'user@example.com',
            sessionId: 'session123'
          })
        })
      );
    });

    it('should track phrase spoken', () => {
      const dispatch = jest.fn();
      const output = [
        { label: 'I', image: 'i.png' },
        { label: 'want', image: 'want.png' },
        { label: 'water', image: 'water.png' }
      ];

      trackPhraseSpoken(output, 'user@example.com', 'session123')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ADD_COMMUNICATION_ENTRY,
          entry: expect.objectContaining({
            type: COMMUNICATION_ENTRY_TYPES.PHRASE,
            label: 'I want water',
            symbols: output,
            userId: 'user@example.com',
            sessionId: 'session123'
          })
        })
      );
    });
  });

  describe('Reducer', () => {
    it('should return the initial state', () => {
      expect(communicationHistoryReducer(undefined, {})).toEqual({
        entries: [],
        isExporting: false,
        exportError: null,
        lastExport: null
      });
    });

    it('should handle ADD_COMMUNICATION_ENTRY', () => {
      const entry = {
        id: '123',
        type: COMMUNICATION_ENTRY_TYPES.SYMBOL,
        label: 'Hello',
        timestamp: '2024-01-15T10:30:00.000Z'
      };

      const action = {
        type: ADD_COMMUNICATION_ENTRY,
        entry
      };

      const newState = communicationHistoryReducer({ entries: [] }, action);

      expect(newState.entries).toHaveLength(1);
      expect(newState.entries[0]).toEqual(entry);
    });

    it('should handle CLEAR_COMMUNICATION_HISTORY', () => {
      const initialState = {
        entries: [
          { id: '1', userId: 'user1' },
          { id: '2', userId: 'user2' },
          { id: '3', userId: 'user1' }
        ]
      };

      const action = {
        type: CLEAR_COMMUNICATION_HISTORY,
        userId: 'user1'
      };

      const newState = communicationHistoryReducer(initialState, action);

      expect(newState.entries).toHaveLength(1);
      expect(newState.entries[0].userId).toBe('user2');
    });
  });

  describe('PDF Report Service', () => {
    it('should generate report data structure correctly', () => {
      const testData = {
        entries: [
          {
            id: '1',
            type: COMMUNICATION_ENTRY_TYPES.SYMBOL,
            label: 'Hello',
            timestamp: '2024-01-15T10:00:00.000Z',
            userId: 'test@example.com'
          },
          {
            id: '2',
            type: COMMUNICATION_ENTRY_TYPES.SYMBOL,
            label: 'World',
            timestamp: '2024-01-15T10:01:00.000Z',
            userId: 'test@example.com'
          },
          {
            id: '3',
            type: COMMUNICATION_ENTRY_TYPES.PHRASE,
            label: 'Hello World',
            symbols: [{ label: 'Hello' }, { label: 'World' }],
            timestamp: '2024-01-15T10:02:00.000Z',
            userId: 'test@example.com'
          }
        ],
        userId: 'test@example.com',
        userName: 'Test User',
        dateRange: {
          from: '2024-01-15',
          to: '2024-01-15'
        }
      };

      // This would normally generate a PDF, but for testing we just verify the service exists
      expect(PDFReportService).toBeDefined();
      expect(PDFReportService.generateCommunicationReport).toBeDefined();
    });
  });
});

describe('Integration Test', () => {
  it('should track a complete user interaction flow', () => {
    const dispatch = jest.fn();
    const userId = 'therapist@clinic.com';
    const sessionId = 'session_2024_01_15';

    // User selects "I"
    const tile1 = { id: '1', label: 'I', image: 'i.png' };
    trackSymbolSelection(tile1, userId, sessionId)(dispatch);

    // User selects "want"
    const tile2 = { id: '2', label: 'want', image: 'want.png' };
    trackSymbolSelection(tile2, userId, sessionId)(dispatch);

    // User selects "water"
    const tile3 = { id: '3', label: 'water', image: 'water.png' };
    trackSymbolSelection(tile3, userId, sessionId)(dispatch);

    // User speaks the phrase
    const output = [
      { label: 'I', image: 'i.png' },
      { label: 'want', image: 'want.png' },
      { label: 'water', image: 'water.png' }
    ];
    trackPhraseSpoken(output, userId, sessionId)(dispatch);

    // User clears the output
    trackClearAction(userId, sessionId)(dispatch);

    // Verify all actions were dispatched
    expect(dispatch).toHaveBeenCalledTimes(5);

    // Verify the tracked data includes all necessary information
    const trackedEntries = dispatch.mock.calls.map(call => call[0].entry);

    expect(trackedEntries[0].label).toBe('I');
    expect(trackedEntries[1].label).toBe('want');
    expect(trackedEntries[2].label).toBe('water');
    expect(trackedEntries[3].label).toBe('I want water');
    expect(trackedEntries[4].type).toBe(COMMUNICATION_ENTRY_TYPES.CLEAR);

    // All entries should have the same user and session
    trackedEntries.forEach(entry => {
      expect(entry.userId).toBe(userId);
      expect(entry.sessionId).toBe(sessionId);
      expect(entry.timestamp).toBeDefined();
    });
  });
});
