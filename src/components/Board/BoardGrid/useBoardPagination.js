import { useLayoutEffect, useState } from 'react';
import { Responsive } from 'react-grid-layout';
import {
  GRID_BREAKPOINTS,
  GRID_DEFAULT_ROWS,
  GRID_GAP,
  GRID_MIN_ROW_HEIGHT
} from '../../Grid/Grid.constants';
import {
  DEFAULT_ROWS_NUMBER,
  DEFAULT_COLUMNS_NUMBER
} from '../Board.constants';

// Measure the actual tile area: toolbars, side buttons and page controls all take space.
export default function useBoardPagination(ref, board, cols, enabled) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({
    boardId: board.id,
    pageSize: 0,
    page: 0,
    enabled
  });
  useLayoutEffect(() => {
    if (!enabled || !ref.current) return;
    const element = ref.current;
    const measure = () =>
      setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled]);

  const breakpoint = Responsive.utils.getBreakpointFromWidth(
    GRID_BREAKPOINTS,
    size.width
  );
  // Keep the existing three-row layout when it fits, reducing rows on short screens.
  const rows = Math.max(
    1,
    Math.min(
      GRID_DEFAULT_ROWS,
      Math.floor((size.height - GRID_GAP) / (GRID_MIN_ROW_HEIGHT + GRID_GAP))
    )
  );
  const pageSize = board.isFixed
    ? (board.grid?.rows || DEFAULT_ROWS_NUMBER) *
      (board.grid?.columns || DEFAULT_COLUMNS_NUMBER)
    : cols[breakpoint] * rows;
  const pageCount = Math.max(1, Math.ceil(board.tiles.length / pageSize));
  const reset =
    position.boardId !== board.id ||
    position.pageSize !== pageSize ||
    position.enabled !== enabled;
  const page = reset ? 0 : Math.min(position.page, pageCount - 1);
  const setPage = (next) =>
    setPosition({
      boardId: board.id,
      pageSize,
      enabled,
      page: Math.max(0, Math.min(next, pageCount - 1))
    });
  useLayoutEffect(() => {
    if (reset || position.page !== page) setPage(page);
  });
  return { page, pageCount, pageSize, rows, setPage };
}
