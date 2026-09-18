import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import useBoardPagination from './useBoardPagination';
import { DISPLAY_SIZE_GRID_COLS } from '../../Settings/Display/Display.constants';

let result;
let resize;
let disconnect;
const element = { clientWidth: 1000, clientHeight: 400 };
const ref = { current: element };
const board = {
  id: 'root',
  tiles: Array.from({ length: 40 }, (_, id) => ({ id }))
};
function Harness({
  board,
  enabled = true,
  cols = DISPLAY_SIZE_GRID_COLS.Standard
}) {
  result = useBoardPagination(ref, board, cols, enabled);
  return null;
}
beforeEach(() => {
  element.clientWidth = 1000;
  element.clientHeight = 400;
  disconnect = jest.fn();
  global.ResizeObserver = jest.fn((callback) => {
    resize = callback;
    return { observe: jest.fn(), disconnect };
  });
});
it('uses actual container size and reaches every tile, clamping both boundaries', () => {
  const wrapper = mount(<Harness board={board} />);
  expect(result.pageSize).toBe(18);
  expect(result.pageCount).toBe(3);
  const ids = [];
  for (let page = 0; page < result.pageCount; page++) {
    act(result.setPage.bind(null, page));
    ids.push(
      ...board.tiles.slice(
        result.page * result.pageSize,
        (result.page + 1) * result.pageSize
      )
    );
  }
  expect(ids).toEqual(board.tiles);
  act(() => result.setPage(99));
  expect(result.page).toBe(2);
  act(() => result.setPage(-1));
  expect(result.page).toBe(0);
  wrapper.unmount();
  expect(disconnect).toHaveBeenCalled();
});
it('resets on board, mode and capacity changes, clamps when tiles are removed', () => {
  const wrapper = mount(<Harness board={board} />);
  act(() => result.setPage(2));
  wrapper.setProps({ board: { ...board, tiles: board.tiles.slice(0, 19) } });
  expect(result.page).toBe(1);
  wrapper.setProps({ board: { ...board, id: 'folder' } });
  expect(result.page).toBe(0);
  act(() => result.setPage(1));
  act(() => {
    element.clientWidth = 350;
    element.clientHeight = 200;
    resize();
  });
  expect(result.pageSize).toBe(6);
  expect(result.page).toBe(0);
  act(() => result.setPage(1));
  wrapper.setProps({ enabled: false });
  wrapper.setProps({ enabled: true });
  expect(result.page).toBe(0);
  wrapper.unmount();
});
it('uses configured fixed-grid dimensions and handles empty boards', () => {
  const wrapper = mount(
    <Harness
      board={{ ...board, isFixed: true, grid: { rows: 4, columns: 2 } }}
    />
  );
  expect(result.pageSize).toBe(8);
  expect(result.pageCount).toBe(5);
  wrapper.setProps({ board: { ...board, tiles: [] } });
  expect(result.pageCount).toBe(1);
  expect(result.page).toBe(0);
  wrapper.unmount();
});
