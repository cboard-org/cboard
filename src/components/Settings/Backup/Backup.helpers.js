import JSZip from 'jszip';
import axios from 'axios';
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
  const value = str.replace(/([A-Z])/g, $1 => '_' + $1.toLowerCase());
  return value.startsWith('_') ? value.slice(1) : value;
}

function getOBFButtonProps(tile = {}, intl) {
  const button = {};

  const tileExtProps = CBOARD_EXT_PROPERTIES.filter(key => !!tile[key]);
  tileExtProps.forEach(key => {
    const keyWithPrefix = `${CBOARD_EXT_PREFIX}${toSnakeCase(key)}`;
    button[keyWithPrefix] = tile[key];
  });

  let label = tile.label || tile.labelKey || '';
  button.label = label.length ? intl.formatMessage({ id: label }) : label;

  if (tile.action) {
    button.action = tile.action;
  }

  if (tile.vocalization) {
    button.vocalization = tile.vocalization;
  }

  if (tile.borderColor) {
    button['border_color'] = tile.borderColor;
  }

  if (tile.backgroundColor) {
    button['background_color'] = tile.backgroundColor;
  }

  return button;
}

async function boardToOBF(boardsMap, board = {}, intl) {
  if (!board.tiles || board.tiles.length < 1) {
    return { obf: null, images: null };
  }

  const images = {};
  const fetchedImages = {};
  const grid = new Array(Math.ceil(board.tiles.length / CBOARD_COLUMNS));
  let currentRow = 0;
  const buttons = await Promise.all(
    board.tiles.map(async (tile, i) => {
      currentRow =
        i >= (currentRow + 1) * CBOARD_COLUMNS ? currentRow + 1 : currentRow;

      if (grid[currentRow]) {
        grid[currentRow].push(tile.id);
      } else {
        grid[currentRow] = [tile.id];
      }

      const button = {
        id: tile.id,
        ...getOBFButtonProps(tile, intl)
      };

      if (tile.image && tile.image.length) {
        const url = tile.image.startsWith('/') ? tile.image : `/${tile.image}`;

        try {
          const imageResponse = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer'
          });

          if (imageResponse) {
            fetchedImages[tile.image] = imageResponse;
            const imageID = `${board.id}_${tile.image}`;
            button['image_id'] = imageID;
            images[imageID] = {
              id: imageID,
              path: `images${url}`,
              content_type: imageResponse.headers['content-type'],
              width: 300,
              height: 300
            };
          }
        } catch (e) {}
      }

      if (tile.loadBoard && boardsMap[tile.loadBoard]) {
        const loadBoardData = boardsMap[tile.loadBoard];
        button['load_board'] = {
          name: loadBoardData.nameKey
            ? intl.formatMessage({ id: loadBoardData.nameKey })
            : '',
          path: `boards/${tile.loadBoard}.obf`
        };
      }

      return button;
    })
  );

  const lastGridRowDiff = CBOARD_COLUMNS - grid[grid.length - 1].length;
  if (lastGridRowDiff > 0) {
    const emptyButtons = new Array(lastGridRowDiff).map(() => null);
    grid[grid.length - 1] = grid[grid.length - 1].concat(emptyButtons);
  }

  const obf = {
    format: 'open-board-0.1',
    id: board.id,
    locale: intl.locale,
    name: intl.formatMessage({ id: board.nameKey || board.id }),
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
    description_html: board.nameKey
      ? intl.formatMessage({ id: board.nameKey })
      : ''
  };

  const boardExtProps = CBOARD_EXT_PROPERTIES.filter(key => !!board[key]);
  boardExtProps.forEach(key => {
    const keyWithPrefix = `${CBOARD_EXT_PREFIX}${toSnakeCase(key)}`;
    obf[keyWithPrefix] = board[key];
  });

  return { obf, images: fetchedImages };
}

export async function openboardExportAdapter(boards = [], intl) {
  const boardsLength = boards.length;
  const boardsForManifest = {};
  const imagesMap = {};
  const zip = new JSZip();

  const boardsMap = boards.reduce((prev, current) => {
    prev[current.id] = current;
    return prev;
  }, {});

  for (let i = 0; i < boardsLength; i++) {
    const board = boards[i];
    const boardMapFilename = `boards/${board.id}.obf`;
    const { obf, images } = await boardToOBF(boardsMap, board, intl);

    if (!obf) {
      continue;
    }

    zip.file(boardMapFilename, JSON.stringify(obf));

    const imagesKeys = Object.keys(images);
    imagesKeys.forEach(key => {
      const imageFilename = `images/${key}`;
      zip.file(imageFilename, images[key].data);
      imagesMap[key] = imageFilename;
    });

    boardsForManifest[board.id] = boardMapFilename;
  }

  const root = boardsForManifest.root
    ? boardsForManifest.root
    : boardsForManifest[Object.keys(boardsMap)[0]];

  const manifest = {
    format: 'open-board-0.1',
    root,
    paths: {
      boards: boardsForManifest,
      images: imagesMap
    }
  };

  zip.file('manifest.json', JSON.stringify(manifest));

  zip.generateAsync(CBOARD_ZIP_OPTIONS).then(content => {
    saveAs(content, EXPORT_CONFIG_BY_TYPE.openboard.filename);
  });
}
