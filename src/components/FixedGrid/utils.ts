import lodash from 'lodash';
import { TileItem } from './../../types';
export interface Grid {
  rows: number;
  columns: number;
  order: GridOrder;
}

export type GridOrder = (string | null)[][];

export function createGrid(rows: number = 2, columns: number = 2): Grid {
  const order = createMatrix(rows, columns);

  const grid = {
    order,
    rows,
    columns
  };

  return grid;
}

function createMatrix(rows: number, columns: number): any[][] {
  const matrix = [...Array(rows)].map(() => [...Array(columns)]);

  return matrix;
}

// TODO: refactor below??

export function moveOrderItem(
  itemId: string,
  position: { row: number; column: number },
  order: GridOrder
) {
  const mappedOrder = order.map(row => {
    return row.map(cell => {
      return cell;
    });
  });

  const oldItem = mappedOrder[position.row][position.column];

  for (let i = 0; i < mappedOrder.length; i++) {
    const itemIndex = mappedOrder[i].indexOf(itemId);

    if (itemIndex !== -1) {
      mappedOrder[i][itemIndex] = oldItem;
      break;
    }
  }

  mappedOrder[position.row][position.column] = itemId;

  return mappedOrder;
}

export function sortGrid({
  columns,
  rows,
  order,
  items
}: {
  columns: number;
  rows: number;
  order: GridOrder;
  items: { id: string;[key: string]: any }[];
}) {
  const grid = createMatrix(rows, columns);
  const itemsToSort = [...items];

  iterateGridItems(order, (id, rowIndex, columnIndex) => {
    const itemIndex = itemsToSort.findIndex(item => item.id === id);
    const itemExists = itemIndex > -1;

    const exceedsBoundaries = rowIndex >= rows || columnIndex >= columns;

    if (itemExists && !exceedsBoundaries) {
      const item = itemsToSort.splice(itemIndex, 1)[0];
      grid[rowIndex][columnIndex] = item;
    }
  });

  return fillEmptyGridCells(grid, itemsToSort);
}

function iterateGridItems(
  grid: any[][],
  callback: (item: any, rowIndex: number, columnIndex: number) => void
) {
  grid.forEach((row, rowIndex) => {
    row.forEach((item, columnIndex) => {
      callback(item, rowIndex, columnIndex);
    });
  });
}

function fillEmptyGridCells(grid: any[][], items: any[]) {
  const itemQueue = [...items];

  return grid.map(row =>
    row.map(item => {
      return item || itemQueue.shift();
    })
  );
}

export function getNewOrder({ columns,
  rows,
  order,
  items
}: {
  columns: number;
  rows: number;
  order: GridOrder;
  items: { id: string;[key: string]: any }[];
}): string[][] {
  const grid = sortGrid({ columns, rows, order, items });
  iterateGridItems(grid, (tile, rowIndex, columnIndex) => {
    grid[rowIndex][columnIndex] = tile?.id;
  })
  return grid;
}

export function removeOrderItems(ids: string, order: GridOrder): GridOrder {
  return order.map(row => row.map(id => (id && ids.includes(id) ? null : id)));
}

export function compatibleDeprecatedChunks({ tileItems, order }:{
  tileItems: Array<TileItem>;
  order: GridOrder;
}):TileItem[][] {
  const firstPageItemsInOrder = order.map(row =>
    row.map(id => tileItems.find(item => item.id === id)||null)
  );

  const firstPage = lodash.flatten(firstPageItemsInOrder);
  const unnorderedTiles = tileItems.filter(
    item => !firstPage.find(tile => tile?.id === item.id)
  );
  const fillEmptyPositionsWithUnnorderedTilesForOldBoards = ({firstPageItemsInOrder,unnorderedTiles}:{firstPageItemsInOrder:(TileItem|null)[][],unnorderedTiles:Array<TileItem> }) => {
    let index = 0;
    const deprecatedFirstPageItemsInOrder = firstPageItemsInOrder.map(row=>
    row.map(item => {
      if (item) return item;
      index++;
      return unnorderedTiles[index - 1]|| null;
    }));
    const deprecatedFirstPage = lodash.flatten(deprecatedFirstPageItemsInOrder).filter(item => item !== null);//
    const restOfTiles = unnorderedTiles.slice(index);

    return {deprecatedFirstPage,restOfTiles};
  }
  
  const {deprecatedFirstPage ,restOfTiles} = fillEmptyPositionsWithUnnorderedTilesForOldBoards({firstPageItemsInOrder,unnorderedTiles});

  const size = firstPage.length;
  const restOfPages = lodash.chunk(restOfTiles, size);
  
  return [deprecatedFirstPage, ...restOfPages];
}
