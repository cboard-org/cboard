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
  items: { id: string; [key: string]: any }[];
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

export function removeOrderItems(ids: string, order: GridOrder): GridOrder {
  return order.map(row => row.map(id => (id && ids.includes(id) ? null : id)));
}
