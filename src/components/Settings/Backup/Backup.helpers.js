import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  EXPORT_CONFIG_BY_TYPE,
  CBOARD_OBF_CONSTANTS,
  CBOARD_COLUMNS,
  CBOARD_EXT_PREFIX,
  CBOARD_EXT_PROPERTIES,
  CBOARD_ZIP_OPTIONS
} from './Backup.constants';

function toSnakeCase(str) {
  const value = str.replace(/([A-Z])/g, function($1) {
    return '_' + $1.toLowerCase();
  });
  return value.startsWith('_') ? value.slice(1) : value;
}

function boardToOBF(boards, board = {}, intl) {
  if (!board.tiles || board.tiles.length < 1) {
    return null;
  }

  const images = {};
  const grid = new Array(Math.ceil(board.tiles.length / CBOARD_COLUMNS));
  let currentRow = 0;
  const buttons = board.tiles.map((tile, i) => {
    currentRow =
      i >= (currentRow + 1) * CBOARD_COLUMNS ? currentRow + 1 : currentRow;

    if (grid[currentRow]) {
      grid[currentRow].push(tile.id);
    } else {
      grid[currentRow] = [tile.id];
    }

    let label = tile.label || tile.labelKey || '';
    label = label.length ? intl.formatMessage({ id: label }) : label;

    const button = {
      id: tile.id,
      label
    };

    const tileExtProps = CBOARD_EXT_PROPERTIES.filter(key => !!tile[key]);
    tileExtProps.forEach(key => {
      const keyWithPrefix = `${CBOARD_EXT_PREFIX}${toSnakeCase(key)}`;
      button[keyWithPrefix] = tile[key];
    });

    if (tile.image && tile.image.length) {
      button['image_id'] = tile.image;
      const [_, set, filename] = tile.image.split('/');
      images[tile.image] = {
        id: tile.image,
        symbol: { set, filename },
        content_type: 'image/svg+xml',
        width: 300,
        height: 300
      };
    }

    if (tile.loadBoard && boards[tile.loadBoard]) {
      const loadBoardData = boards[tile.loadBoard];
      button['load_board'] = {
        name: loadBoardData.nameKey,
        data_url: `${CBOARD_OBF_CONSTANTS.DATA_URL}${loadBoardData.id}`,
        url: `${CBOARD_OBF_CONSTANTS.URL}${loadBoardData.id}`
      };
    }

    return button;
  });

  const lastGridRowDiff = CBOARD_COLUMNS - grid[grid.length - 1].length;
  if (lastGridRowDiff > 0) {
    const emptyButtons = new Array(lastGridRowDiff).map(() => null);
    grid[grid.length - 1] = grid[grid.length - 1].concat(emptyButtons);
  }

  const obf = {
    format: 'open-board-0.1',
    id: board.id,
    locale: intl.locale,
    name: board.nameKey || board.id,
    url: `${CBOARD_OBF_CONSTANTS.URL}${board.id}`,
    license: CBOARD_OBF_CONSTANTS.LICENSE,
    images: Object.values(images),
    buttons,
    sounds: [],
    grid: {
      rows: grid.length,
      columns: CBOARD_COLUMNS,
      order: grid
    },
    description_html: ''
  };

  return obf;
}

export function openboardExportAdapter(boards = [], intl) {
  const boardsLength = boards.length;
  const boardsMap = {};
  const zip = new JSZip();
  for (let i = 0; i < boardsLength; i++) {
    const board = boards[i];
    const boardMapFilename = `boards/${board.id}.obf`;
    const data = boardToOBF(boards, board, intl);

    if (!data) {
      continue;
    }

    zip.file(boardMapFilename, JSON.stringify(data));
    boardsMap[board.id] = boardMapFilename;
  }

  const root = boardsMap.root
    ? boardsMap.root
    : boardsMap[Object.keys(boardsMap)[0]];

  const manifest = {
    format: 'open-board-0.1',
    root,
    paths: {
      boards: boardsMap
    }
  };

  zip.file('manifest.json', JSON.stringify(manifest));

  zip.generateAsync(CBOARD_ZIP_OPTIONS).then(content => {
    saveAs(content, EXPORT_CONFIG_BY_TYPE.openboard.filename);
  });
}
