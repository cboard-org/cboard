import React from 'react';
import { shallow } from 'enzyme';
import Board from '../Board.component';

/* =============================================================================
   MOCKS
   Silencing console warnings and mocking dependencies
   ============================================================================= */
jest.mock('../Board.messages', () => ({
  editTitle: { id: 'mock.editTitle', defaultMessage: 'Edit Title' },
  boardTitle: { id: 'mock.boardTitle', defaultMessage: 'Title' },
  boardEditTitleCancel: { id: 'mock.cancel', defaultMessage: 'Cancel' },
  boardEditTitleAccept: { id: 'mock.accept', defaultMessage: 'Accept' },
  emptyVoiceAlert: { id: 'mock.empty', defaultMessage: 'Empty Voice' },
  offlineChangeVoice: { id: 'mock.offline', defaultMessage: 'Offline Voice' },
  offlineVoiceAlert: { id: 'mock.alert', defaultMessage: 'Voice Alert' }
}));

const intlMock = {
  formatMessage: ({ defaultMessage }) => defaultMessage
};

/* =============================================================================
   DEFAULT PROPS
   Added 'disableTour' to fix the console warning
   ============================================================================= */
const defaultProps = {
  intl: intlMock,
  onAddRemoveColumn: () => {},
  onAddRemoveRow: () => {},
  onLockNotify: () => {},
  deactivateScanner: () => {},
  onRequestPreviousBoard: () => {},
  onScannerActive: () => {},
  disableTour: jest.fn(), // <--- Added to fix warning
  actions: {
    updateBoard: jest.fn(),
    speak: jest.fn()
  },
  displaySettings: {
    uiSize: 'Standard',
    hideOutputActive: false,
    expandedOutputActive: false
  },
  scannerSettings: { active: false },
  userData: {},
  navigationSettings: {},
  selectedTileIds: [],
  board: {
    id: 'root',
    name: 'test-board',
    tiles: []
  }
};

/* =============================================================================
   TEST SUITE
   ============================================================================= */
describe('Board Output Expansion Feature', () => {
  it('should not have the expanded class by default', () => {
    const wrapper = shallow(<Board {...defaultProps} />);
    const outputDiv = wrapper.find('.Board__output');
    expect(outputDiv.exists()).toBe(true);
    expect(outputDiv.hasClass('Board__output--expanded')).toBe(false);
  });

  it('should have the expanded class when setting is enabled', () => {
    const props = {
      ...defaultProps,
      displaySettings: {
        ...defaultProps.displaySettings,
        expandedOutputActive: true
      }
    };
    const wrapper = shallow(<Board {...props} />);
    const outputDiv = wrapper.find('.Board__output');
    expect(outputDiv.hasClass('Board__output--expanded')).toBe(true);
  });

  it('should have both hidden and expanded classes when conflict occurs', () => {
    const props = {
      ...defaultProps,
      displaySettings: {
        hideOutputActive: true,
        expandedOutputActive: true
      }
    };
    const wrapper = shallow(<Board {...props} />);
    const outputDiv = wrapper.find('.Board__output');
    expect(outputDiv.hasClass('hidden')).toBe(true);
    expect(outputDiv.hasClass('Board__output--expanded')).toBe(true);
  });

  it('should gracefully handle undefined setting', () => {
    const props = {
      ...defaultProps,
      displaySettings: {
        uiSize: 'Standard'
      }
    };
    const wrapper = shallow(<Board {...props} />);
    const outputDiv = wrapper.find('.Board__output');
    expect(outputDiv.hasClass('Board__output--expanded')).toBe(false);
  });

  it('should gracefully handle null setting', () => {
    const props = {
      ...defaultProps,
      displaySettings: {
        expandedOutputActive: null
      }
    };
    const wrapper = shallow(<Board {...props} />);
    const outputDiv = wrapper.find('.Board__output');
    expect(outputDiv.hasClass('Board__output--expanded')).toBe(false);
  });

  it('should gracefully handle empty displaySettings object', () => {
    const props = {
      ...defaultProps,
      displaySettings: {}
    };
    const wrapper = shallow(<Board {...props} />);
    const outputDiv = wrapper.find('.Board__output');
    expect(outputDiv.hasClass('Board__output--expanded')).toBe(false);
  });

  it('should maintain expanded state regardless of other display setting changes', () => {
    const props = {
      ...defaultProps,
      displaySettings: {
        expandedOutputActive: true,
        uiSize: 'Large'
      }
    };
    const wrapper = shallow(<Board {...props} />);
    const outputDiv = wrapper.find('.Board__output');
    expect(outputDiv.hasClass('Board__output--expanded')).toBe(true);
  });
});
