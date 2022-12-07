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
    },
    connectionError: {
      id: 'cboard.components.SymbolSearch.connectionError',
      defaultMessage: 'Available symbols are limited during editing offline'
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
    onAddSubmit: jest.fn(),
    showNotification: jest.fn()
  };

  test('default renderer', () => {
    matchSnapshotWithIntlProvider(<TileEditor {...props} />);
  });
  test('mount renderer', () => {
    const wrapper = shallow(<TileEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('should render notification if offline', () => {
    // 1. Mock the Navigator Object to set the stage
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);
    // 2. Render the TileEditor Component (why does MOUNT not work when we use mount method instead of shallow?)
    const wrapper = shallow(<TileEditor {...props} />);

    // HIGH LEVEL LOGIC
    // 1. We want to render tileEditor and SymbolSearch (thus use mount function to render children too)
    // 2. We want to click on the button on tileEditor which will transition to symbolsearch component
    // 3. Then check DOM for the showNotification message

    console.log(wrapper.debug());

    wrapper.find('.hello').simulate('click');
    console.log('BUTTON CLICKED');
    console.log(wrapper.debug());
    // expect(onButtonClick).to.have.property('callCount', 1);

    // We render tileEditor
    // Then we click on the search Button

    // We want to check for the error message

    // Look into tests with showNotification as examples
    // expect(wrapper.find('#offlineMsg')).toHaveLength(0);
    // 3. Expect the div tag notification to exist in the UI

    // expect(wrapper.exists('#offlineMsg')).toEqual(false);
    // expect(wrapper.find('#offlineMsg')).toBeDefined();
    // console.log('BEFORE THIS')
    // console.log(wrapper.find('#offlineMsg').debug());
    // expect(wrapper).toMatchSnapshot();
  });

  // test('should not render notification if online', () => {
  //   // 1. Mock the Navigator Object to set the stage
  //   jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);
  //   // 2. Render the SymbolSearch Component
  //   const wrapper = shallow(<SymbolSearch {...props} />);
  //   // 3. Expect the div tag notification to not exist in the UI
  //   // expect(wrapper.exists('#offlineMsg')).toEqual(false);
  //   expect(wrapper.find('#offlineMsg').exists()).toBeFalsy();
  //   // expect(wrapper).toMatchSnapshot();

  //   // Maybe issue is that we need to await for the render to occur
  // });
});
