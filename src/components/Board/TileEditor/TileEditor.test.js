import React from 'react';
import { mount, shallow } from 'enzyme';
import { matchSnapshotWithIntlProvider } from '../../../common/test_utils';

import TileEditor from './TileEditor.component';

jest.mock('./TileEditor.messages', () => {
  return {
    createTile: {
      id: 'cboard.components.Board.TileEditor.createTile',
      defaultMessage: 'Create tile'
    },
    editTile: {
      id: 'cboard.components.Board.TileEditor.editTile',
      defaultMessage: 'Edit Tile'
    },
    label: {
      id: 'cboard.components.Board.TileEditor.label',
      defaultMessage: 'Label'
    },
    vocalization: {
      id: 'cboard.components.Board.TileEditor.vocalization',
      defaultMessage: 'Vocalization'
    },
    voiceRecorder: {
      id: 'cboard.components.Board.TileEditor.voiceRecorder',
      defaultMessage: 'Voice Recorder'
    },
    button: {
      id: 'cboard.components.Board.TileEditor.button',
      defaultMessage: 'Button'
    },
    folder: {
      id: 'cboard.components.Board.TileEditor.folder',
      defaultMessage: 'Folder'
    },
    type: {
      id: 'cboard.components.Board.TileEditor.type',
      defaultMessage: 'Type'
    },
    back: {
      id: 'cboard.components.Board.TileEditor.back',
      defaultMessage: 'Back'
    },
    next: {
      id: 'cboard.components.Board.TileEditor.next',
      defaultMessage: 'Next'
    },
    symbolSearch: {
      id: 'cboard.components.Board.TileEditor.symbolSearch',
      defaultMessage: 'Symbol search'
    }
  };
});
describe('TileEditor tests', () => {
  const props = {
    intl: {
      formatMessage: jest.fn(),
      locale: 'en-US'
    },
    open: true,
    onClose: jest.fn(),
    editingTiles: [],
    onEditSubmit: jest.fn(),
    onAddSubmit: jest.fn()
  };

  test('default renderer', () => {
    matchSnapshotWithIntlProvider(<TileEditor {...props} />);
  });
  test('mount renderer', () => {
    const wrapper = shallow(<TileEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
