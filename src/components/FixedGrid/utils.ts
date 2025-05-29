import lodash from 'lodash';
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

interface TileItem {
  id: string;
  label?: string;
  labelKey?: string;
  vocalization?: string;
  image: string;
  loadBoard?: string;
  sound?: string;
  type?: string;
  backgroundColor: string;
  linkedBoard?: boolean;
}

export function deprecatedChunks(tileItems: Array<TileItem>, size: number) {
  const newArray = [...tileItems];
  const results = [];

  while (newArray.length) {
    results.push(newArray.splice(0, size));
  }

  return results;
}

export function chunks({ tileItems, order }:{
  tileItems: Array<TileItem>;
  order: GridOrder;
}) {
  const firstPageItemsInOrder = order.map(row =>
    row.map(id => tileItems.find(item => item.id === id))
  );

  const firstPage = lodash.flatten(firstPageItemsInOrder);

  const size = firstPage.length;

  const restOfItems = tileItems.filter(
    item => !firstPage.find(firstItem => firstItem?.id === item.id)
  );
  const restOfPages = lodash.chunk(restOfItems, size);

  return [firstPage, ...restOfPages];
}
