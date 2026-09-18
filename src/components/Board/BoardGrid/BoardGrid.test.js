import React from 'react';
import { shallow } from 'enzyme';
import BoardGrid from './BoardGrid.component';
import BoardPagination from './BoardPagination';
import Grid from '../../Grid';
import FixedGrid from '../../FixedGrid';
import ScrollButtons from '../../ScrollButtons';

const props = {
  board: {
    id: 'root',
    tiles: Array.from({ length: 30 }, (_, id) => ({
      id: String(id),
      label: String(id)
    }))
  },
  displaySettings: { uiSize: 'Standard' },
  navigationSettings: {
    boardNavigationMode: 'pagination',
    bigScrollButtonsActive: true
  },
  scannerSettings: { active: false },
  selectedTileIds: [],
  intl: { formatMessage: (message) => message.defaultMessage },
  boardContainerRef: { current: null },
  fixedBoardContainerRef: { current: null },
  navHistory: [],
  onTileClick: jest.fn(),
  onFocusTile: jest.fn(),
  onTileDrop: jest.fn(),
  onAddRemoveRow: jest.fn(),
  onAddRemoveColumn: jest.fn(),
  onLayoutChange: jest.fn()
};
it('paginates without giving the partial layout to the board-saving callback', () => {
  const wrapper = shallow(<BoardGrid {...props} />);
  expect(wrapper.find(Grid).prop('onLayoutChange')).toBeUndefined();
  expect(wrapper.find(Grid).prop('children')).toHaveLength(3);
  expect(wrapper.find(ScrollButtons)).toHaveLength(0);
  wrapper.find(BoardPagination).prop('onChange')(1);
  expect(wrapper.find(Grid).prop('children')[0].key).toBe('3');
});
it.each([undefined, 'scroll'])(
  'keeps all tiles and existing scroll behavior for %s mode',
  (mode) => {
    const wrapper = shallow(
      <BoardGrid
        {...props}
        navigationSettings={{
          ...props.navigationSettings,
          boardNavigationMode: mode
        }}
      />
    );
    expect(wrapper.find(BoardPagination)).toHaveLength(0);
    expect(wrapper.find(Grid).prop('children')).toHaveLength(30);
    expect(wrapper.find(Grid).prop('onLayoutChange')).toBe(
      props.onLayoutChange
    );
    expect(wrapper.find(ScrollButtons)).toHaveLength(1);
  }
);
it('edits the complete board, even when pagination is the preferred navigation mode', () => {
  const wrapper = shallow(<BoardGrid {...props} isSelecting />);
  expect(wrapper.find(BoardPagination)).toHaveLength(0);
  expect(wrapper.find(Grid).prop('children')).toHaveLength(30);
  expect(wrapper.find(Grid).prop('edit')).toBe(true);
  expect(wrapper.find(Grid).prop('onLayoutChange')).toBe(props.onLayoutChange);
});
it('selects existing fixed pages without slicing or rewriting their ordering', () => {
  const board = {
    ...props.board,
    isFixed: true,
    grid: { rows: 2, columns: 3, order: [['2', '1', '0']] }
  };
  const wrapper = shallow(<BoardGrid {...props} board={board} />);
  wrapper.find(BoardPagination).prop('onChange')(2);
  expect(wrapper.find(FixedGrid).prop('page')).toBe(2);
  expect(wrapper.find(FixedGrid).prop('items')).toBe(board.tiles);
  expect(wrapper.find(FixedGrid).prop('order')).toBe(board.grid.order);
});
