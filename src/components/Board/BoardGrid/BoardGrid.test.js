import React from 'react';
import { shallow } from 'enzyme';
import BoardGrid from './BoardGrid.component';
import { Scannable } from 'react-scannable';
import BoardPagination from './BoardPagination';
import Grid from '../../Grid';
import FixedGrid from '../../FixedGrid';
import ScrollButtons from '../../ScrollButtons';
import NavigationButtons from '../../NavigationButtons';
import { NAVIGATION_BUTTONS_STYLE_TOP } from '../../Settings/Navigation/Navigation.constants';

jest.unmock('react-intl');

const paginationIntl = {
  formatMessage: ({ defaultMessage }, values = {}) =>
    defaultMessage.replace(/\{(\w+)\}/g, (_, key) => values[key])
};

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
it.each([
  ['pagination', true],
  ['scroll', false]
])(
  'back buttons in %s mode are on the sides: %s, even with the overlay style',
  (mode, onTheSide) => {
    const wrapper = shallow(
      <BoardGrid
        {...props}
        navigationSettings={{
          boardNavigationMode: mode,
          caBackButtonActive: true,
          navigationButtonsStyle: NAVIGATION_BUTTONS_STYLE_TOP
        }}
      />
    );
    expect(
      wrapper.find(NavigationButtons).prop('isNavigationButtonsOnTheSide')
    ).toBe(onTheSide);
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

it.each([0, 1, 2])(
  'page controls wrap from page %s in both directions',
  (page) => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <BoardPagination
        page={page}
        pageCount={3}
        onChange={onChange}
        intl={paginationIntl}
      />
    );
    const buttons = wrapper.find('button');
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => {
      expect(button.prop('disabled')).toBe(false);
    });
    expect(wrapper.find('.SideNavigationButton.disable')).toHaveLength(0);
    expect(buttons.at(0).prop('aria-label')).toBe(
      page === 0 ? 'Last page' : 'Previous page'
    );
    expect(buttons.at(1).prop('aria-label')).toBe(
      page === 2 ? 'First page' : 'Next page'
    );
    expect(buttons.at(0).find('.BoardPagination__counter').text()).toBe(
      `${page + 1} / 3`
    );
    expect(wrapper.find('[role="status"]').text()).toBe(
      `Page ${page + 1} of 3`
    );
    buttons.at(0).simulate('click');
    expect(onChange).toHaveBeenLastCalledWith((page + 2) % 3);
    buttons.at(1).simulate('click');
    expect(onChange).toHaveBeenLastCalledWith((page + 1) % 3);
    expect(
      wrapper.find(Scannable).everyWhere((control) => !control.prop('disabled'))
    ).toBe(true);
  }
);
it('greys out page controls and disables scanning when there is only one page', () => {
  const wrapper = shallow(
    <BoardPagination
      page={0}
      pageCount={1}
      onChange={jest.fn()}
      intl={paginationIntl}
    />
  );
  expect(
    wrapper.find('button').everyWhere((button) => button.prop('disabled'))
  ).toBe(true);
  expect(wrapper.find('.SideNavigationButton.disable')).toHaveLength(2);
  expect(
    wrapper.find(Scannable).everyWhere((control) => control.prop('disabled'))
  ).toBe(true);
});
