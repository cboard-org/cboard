import React from 'react';
import { shallow } from 'enzyme';

// Mock heavy children components that Board imports
jest.mock('../Output', () => () => <div />);
jest.mock('../Navbar', () => () => <div />);
jest.mock('../BoardTour/BoardTour', () => () => <div />);
jest.mock('../EditToolbar', () => () => <div />);
jest.mock('../ImprovePhraseOutput', () => () => <div />);

// These must use the SAME strings as in Board.component.js
jest.mock('../../Communicator/CommunicatorToolbar', () => () => <div />);
jest.mock('../../NavigationButtons', () => () => <div />);
jest.mock('../../EditGridButtons', () => () => <div />);
jest.mock('../../ScrollButtons', () => () => <div />);

// Mock messages
jest.mock('../Board.messages', () => ({
  editTitle: { id: 'editTitle', defaultMessage: 'Edit Title' },
  boardTitle: { id: 'boardTitle', defaultMessage: 'Board Title' },
  boardEditTitleCancel: { id: 'cancel', defaultMessage: 'Cancel' },
  boardEditTitleAccept: { id: 'accept', defaultMessage: 'Accept' }
}));

// Mock helpers
jest.mock('../../../helpers', () => ({
  resolveTileLabel: tile => tile.label || '',
  resolveBoardName: () => 'Test Board'
}));

import { Board } from '../Board.component';

describe('Board.renderTiles - tile filtering', () => {
  const createBoardInstance = () => {
    const props = {
      board: { id: 'test-board', name: 'Test Board', tiles: [] },
      intl: { formatMessage: jest.fn(({ id }) => id) },
      displaySettings: { uiSize: 'Standard', labelPosition: 'Below' },
      navigationSettings: {},
      scannerSettings: { active: false, delay: 2000, strategy: 'automatic' },
      userData: {},
      isSelecting: false,
      isSaving: false,
      selectedTileIds: [],
      onScannerActive: jest.fn(),
      onTileClick: jest.fn(),
      onFocusTile: jest.fn(),
      onRequestPreviousBoard: jest.fn(),
      onRequestToRootBoard: jest.fn(),
      onAddClick: jest.fn(),
      onDeleteClick: jest.fn(),
      onEditClick: jest.fn(),
      onSaveBoardClick: jest.fn(),
      onSelectAllToggle: jest.fn(),
      onSelectClick: jest.fn(),
      onLockClick: jest.fn(),
      onLockNotify: jest.fn(),
      onBoardTypeChange: jest.fn(),
      onAddRemoveRow: jest.fn(),
      onAddRemoveColumn: jest.fn(),
      onLayoutChange: jest.fn(),
      disableTour: jest.fn(),
      setIsScroll: jest.fn(),
      changeDefaultBoard: jest.fn()
    };
    const wrapper = shallow(<Board {...props} />);
    return wrapper.instance();
  };

  it('filters out tiles that are null, undefined, or missing a valid string id', () => {
    const instance = createBoardInstance();

    const tiles = [
      { id: 'valid-1', label: 'Valid Tile 1' },
      null, // should be filtered
      undefined, // should be filtered
      { label: 'No id' }, // should be filtered
      { id: '', label: 'Empty id' }, // should be filtered
      { id: 123, label: 'Number id' }, // should be filtered
      { id: 'valid-2', label: 'Valid Tile 2' }
    ];

    const rendered = instance.renderTiles(tiles);

    expect(rendered).toHaveLength(2);
    expect(rendered[0].key).toBe('valid-1');
    expect(rendered[1].key).toBe('valid-2');
  });

  it('handles null or undefined tiles array gracefully', () => {
    const instance = createBoardInstance();

    expect(instance.renderTiles(null)).toHaveLength(0);
    expect(instance.renderTiles(undefined)).toHaveLength(0);
  });
});
