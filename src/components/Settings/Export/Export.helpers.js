import JSZip from 'jszip';
import axios from 'axios';
import moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import {
  EXPORT_CONFIG_BY_TYPE,
  CBOARD_OBF_CONSTANTS,
  CBOARD_COLUMNS,
  CBOARD_ROWS,
  CBOARD_EXT_PREFIX,
  CBOARD_EXT_PROPERTIES,
  CBOARD_ZIP_OPTIONS,
  NOT_FOUND_IMAGE,
  EMPTY_IMAGE
} from './Export.constants';
import {
  LABEL_POSITION_ABOVE,
  LABEL_POSITION_BELOW
} from '../Display/Display.constants';
import {
  isAndroid,
  isCordova,
  requestCvaWritePermissions,
  writeCvaFile
} from '../../../cordova-util';
import { getStore } from '../../../store';
import * as _ from 'lodash';
import mime from 'mime-types';
import mongoose from 'mongoose';
import * as utils from '../../../components/FixedGrid/utils';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const imageElement = new Image();

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

  const label = tile.label || tile.labelKey || '';
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

function getBase64Image(base64Str = '') {
  const [prefix, base64Data] = base64Str.split(',');
  const contentType = prefix.split(':')[1].split(';')[0];
  const byteString = atob(base64Data);

  // https://gist.github.com/fupslot/5015897
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return {
    ab,
    data: base64Str,
    content_type: contentType
  };
}

export async function getDataUri(url) {
  try {
    const result = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    });

    // Convert the array buffer to a Base64-encoded string.
    const encodedImage = btoa(
      new Uint8Array(result.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    const contentType = result.headers['content-type'];

    return {
      ab: result.data,
      content_type: contentType,
      data: `data:${contentType};base64,${encodedImage}`
    };
  } catch (e) {
    console.error(`Failed to get image at ${url}.`, e);
  }
}

/**
 * Generate the contents of an OBF file for a single board, and get the
 * associated images.
 *
 * @param boardsMap A map of boards by id.
 * @param board The board to export.
 * @param intl
 * @param embed Whether or not to embed images directly in the OBF file. Should
 *              be true when we're exporting a single board, as we won't generate
 *              an OBZ archive.
 */
// TODO: Embed sounds as well.
async function boardToOBF(boardsMap, board = {}, intl, { embed = false }) {
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

      if (tile) {
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
          // Cordova path cannot be absolute
          const image =
            isCordova() && tile.image && tile.image.search('/') === 0
              ? `.${tile.image}`
              : tile.image;

          const imageResponse = image.startsWith('data:')
            ? getBase64Image(image)
            : await getDataUri(image);

          const getCustomImagePath = () => {
            const components = [
              'custom',
              board.name || board.nameKey,
              tile.label || tile.labelKey || tile.id
            ];
            const extension = mime.extension(imageResponse['content_type']);
            return `/${_.join(components, '/')}.${extension}`;
          };

          const path = image.startsWith('data:')
            ? getCustomImagePath()
            : isCordova()
            ? ''
            : image.startsWith('/')
            ? image
            : `/${image}`;

          if (imageResponse) {
            const imageID = new mongoose.Types.ObjectId().toString();
            fetchedImages[imageID] = _.defaults({ path }, imageResponse);
            button['image_id'] = imageID;
            images[imageID] = {
              id: imageID,
              // If images are embedded and we're generating a single OBF
              // file, the path is unnecessary.
              path: embed ? undefined : path,
              data: embed ? imageResponse.data : undefined,
              content_type: imageResponse['content_type'],
              width: 300,
              height: 300
            };
          }
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
      }
    })
  );

  if (grid.length >= 1) {
    const lastGridRowDiff = CBOARD_COLUMNS - grid[grid.length - 1].length;
    if (lastGridRowDiff > 0) {
      const emptyButtons = new Array(lastGridRowDiff).map(() => null);
      grid[grid.length - 1] = grid[grid.length - 1].concat(emptyButtons);
    }

    const obf = {
      format: 'open-board-0.1',
      id: board.id,
      locale: intl.locale,
      name: board.name,
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

    const boardExtProps = CBOARD_EXT_PROPERTIES.filter(
      key => typeof board[key] !== 'undefined'
    );
    boardExtProps.forEach(key => {
      const keyWithPrefix = `${CBOARD_EXT_PREFIX}${toSnakeCase(key)}`;
      obf[keyWithPrefix] = board[key];
    });

    return { obf, images: fetchedImages };
  } else {
    return { obf: null, images: null };
  }
}

function getPDFTileData(tile, intl) {
  const label = tile.label || tile.labelKey || '';
  return {
    label: label.length ? intl.formatMessage({ id: label }) : label,
    image: tile.image || ''
  };
}

async function toDataURL(url, styles = {}, outputFormat = 'image/jpeg') {
  return new Promise((resolve, reject) => {
    imageElement.crossOrigin = 'Anonymous';
    imageElement.onload = function() {
      const canvas = document.createElement('CANVAS');
      const ctx = canvas.getContext('2d');
      const backgroundColor = styles.backgroundColor || 'white';
      const borderColor = styles.borderColor || null;
      canvas.height = 150;
      canvas.width = 150;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }

      let widthFix = 1;
      let heightFix = 1;
      const needToScale = this.naturalWidth > 150 || this.naturalHeight > 150;
      if (needToScale) {
        widthFix = 150 / this.naturalWidth;
        heightFix = 150 / this.naturalHeight;
      }

      ctx.drawImage(
        this,
        0,
        0,
        this.naturalWidth * widthFix,
        this.naturalHeight * heightFix
      );

      if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, 150, 150);
      }
      const dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
    };
    imageElement.onerror = function() {
      reject(new Error('Getting remote image failed'));
    };
    // Cordova path cannot be absolute
    const imageUrl =
      isCordova() && url && url.search('/') === 0 ? `.${url}` : url;
    if (url) {
      imageElement.src = imageUrl;
    } else {
      imageElement.src = EMPTY_IMAGE;
    }
    if (imageElement.complete || imageElement.complete === undefined) {
      if (url) {
        imageElement.src = imageUrl;
      } else {
        imageElement.src = EMPTY_IMAGE;
      }
    }
  });
}

async function generatePDFBoard(board, intl, breakPage = true) {
  const header = board.name || '';
  const columns =
    board.isFixed && board.grid ? board.grid.columns : CBOARD_COLUMNS;
  const rows = board.isFixed && board.grid ? board.grid.rows : CBOARD_ROWS;
  const table = {
    table: {
      widths: '*',
      body: [{}]
    },
    layout: 'noBorders'
  };

  if (breakPage) {
    table.pageBreak = 'after';
  }

  if (!board.tiles || !board.tiles.length) {
    return [header, table];
  }

  const grid = board.isFixed
    ? await generateFixedBoard(board, rows, columns, intl, table)
    : await generateNonFixedBoard(board, rows, columns, intl, table);

  const lastGridRowDiff = columns - grid[grid.length - 2].length; // labels row
  if (lastGridRowDiff > 0) {
    const emptyCells = new Array(lastGridRowDiff).fill('');
    grid[grid.length - 2] = grid[grid.length - 2].concat(emptyCells); // labels
    grid[grid.length - 1] = grid[grid.length - 1].concat(emptyCells); // images
  }

  table.table.body = grid;

  return [header, table];
}

function chunks(array, size) {
  const newArray = [...array];
  const results = [];

  while (newArray.length) {
    results.push(newArray.splice(0, size));
  }

  return results;
}

async function generateFixedBoard(board, rows, columns, intl) {
  let currentRow = 0;
  let cont = 0;

  const defaultTile = {
    label: '',
    labelKey: '',
    image: '',
    backgroundColor: '#d9d9d9'
  };

  const itemsPerPage = rows * columns;
  const pages = chunks(board.tiles, itemsPerPage);
  const grid = new Array(board.grid.rows * 2 * pages.length);

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const items = pages[pageIndex];
    const order = utils.getNewOrder({
      columns,
      rows,
      order: board.grid.order,
      items
    });
    for (let rowIndex = 0; rowIndex < order.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < order[rowIndex].length;
        columnIndex++
      ) {
        const tileId = order[rowIndex][columnIndex];
        let tile = board.tiles.find(tile => tile.id === tileId);
        if (tile === undefined) {
          tile = defaultTile;
        }
        currentRow =
          cont >= (currentRow + 1) * columns ? currentRow + 1 : currentRow;
        let pageBreak = false;
        if (
          (currentRow + 1) % rows === 0 &&
          pages.length > 0 &&
          currentRow + 1 < pages.length * rows
        ) {
          pageBreak = true;
        }

        await addTileToGrid(
          tile,
          intl,
          grid,
          rows,
          columns,
          currentRow,
          pageBreak
        );
        cont++;
      }
    }
  }
  return grid;
}

async function generateNonFixedBoard(board, rows, columns, intl) {
  // Do a grid with 2n rows
  const grid = new Array(Math.ceil(board.tiles.length / columns) * 2);
  let currentRow = 0;

  await board.tiles.reduce(async (prev, tile, i) => {
    // Wait for previous tile
    await prev;
    currentRow = i >= (currentRow + 1) * columns ? currentRow + 1 : currentRow;
    return await addTileToGrid(tile, intl, grid, rows, columns, currentRow);
  }, Promise.resolve());
  return grid;
}

const addTileToGrid = async (
  tile,
  intl,
  grid,
  rows,
  columns,
  currentRow,
  pageBreak = false
) => {
  const { label, image } = getPDFTileData(tile, intl);
  const fixedRow = currentRow * 2;
  let imageData = '';
  let dataURL = image;
  if (
    !image.startsWith('data:') ||
    image.startsWith('data:image/svg+xml') ||
    image.startsWith('data:image/png')
  ) {
    let url = image;
    const styles = {};
    if (tile.backgroundColor) {
      styles.backgroundColor = tile.backgroundColor;
    }
    if (tile.borderColor) {
      styles.borderColor = tile.borderColor;
    }
    try {
      dataURL = await toDataURL(url, styles);
    } catch (err) {
      console.log(err.message);
      dataURL = NOT_FOUND_IMAGE;
    }
  }
  imageData = {
    image: dataURL,
    alignment: 'center',
    width: '100'
  };

  const labelData = {
    text: label,
    alignment: 'center'
  };

  if (11 === columns || columns === 12 || rows >= 6) {
    imageData.width = '59';
    labelData.fontSize = 9;
  } else if (9 === columns || columns === 10 || rows === 5) {
    imageData.width = '70';
  } else if (7 === columns || columns === 8) {
    imageData.width = '90';
  }

  const displaySettings = getDisplaySettings();
  let value1,
    value2 = {};
  if (
    displaySettings.labelPosition &&
    displaySettings.labelPosition === LABEL_POSITION_BELOW
  ) {
    value1 = imageData;
    value2 = labelData;
  } else if (
    displaySettings.labelPosition &&
    displaySettings.labelPosition === LABEL_POSITION_ABOVE
  ) {
    value2 = imageData;
    value1 = labelData;
  } else {
    // Add an empty label to have more vertical space between tiles.
    value1 = { text: ' ' };
    value2 = imageData;
  }

  // Add a page break when we reach the maximum number of rows on the
  // current page.
  if (pageBreak) {
    value2.pageBreak = 'after';
  }

  if (grid[fixedRow]) {
    grid[fixedRow].push(value1);
    grid[fixedRow + 1].push(value2);
  } else {
    grid[fixedRow] = [value1];
    grid[fixedRow + 1] = [value2];
  }
  return grid;
};

const getDisplaySettings = () => {
  const store = getStore();
  const {
    app: { displaySettings }
  } = store.getState();

  return displaySettings;
};

/**
 * Get a filename prefix with the current date and time.
 */
const getDatetimePrefix = () => moment().format('YYYY-MM-DD_HH-mm-ss-');

/**
 * Export one or several boards in the Open Board Format. If we specifically
 * want to export a single board, we generate a single OBF file, otherwise
 * we generate an OBZ archive.
 *
 * @param boardOrBoards A board, or an array of boards.
 * @param intl
 * @returns {Promise<void>} Nothing.
 */
export async function openboardExportAdapter(boardOrBoards, intl) {
  return _.isArray(boardOrBoards)
    ? openboardExportManyAdapter(boardOrBoards, intl)
    : openboardExportOneAdapter(boardOrBoards, intl);
}

export async function openboardExportOneAdapter(board, intl) {
  const { obf } = await boardToOBF({ [board.id]: board }, board, intl, {
    embed: true
  });
  const content = new Blob([JSON.stringify(obf, null, 2)], {
    type: 'application/json'
  });

  if (content) {
    // TODO: Remove illegal characters from the board name.
    const prefix = getDatetimePrefix() + board.name + ' ';
    if (isAndroid()) {
      requestCvaWritePermissions();
      writeCvaFile('Download/' + prefix + 'board.obf', content);
    } else {
      saveAs(content, prefix + 'board.obf');
    }
  }
}

export async function openboardExportManyAdapter(boards = [], intl) {
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
    const { obf, images } = await boardToOBF(boardsMap, board, intl, {
      embed: false
    });

    if (!obf) {
      continue;
    }

    zip.file(boardMapFilename, JSON.stringify(obf, null, 2));

    const imagesKeys = Object.keys(images);
    imagesKeys.forEach(key => {
      const image = images[key];
      const imageFilename = `images/${image.path}`;
      zip.file(imageFilename, image.ab);
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

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  zip.generateAsync(CBOARD_ZIP_OPTIONS).then(content => {
    if (content) {
      let prefix = getDatetimePrefix();
      if (boards.length === 1) {
        prefix = prefix + boards[0].name + ' ';
      } else {
        prefix = prefix + 'boardsset ';
      }
      if (isAndroid()) {
        requestCvaWritePermissions();
        const name =
          'Download/' + prefix + EXPORT_CONFIG_BY_TYPE.openboard.filename;
        writeCvaFile(name, content);
      } else {
        saveAs(content, prefix + EXPORT_CONFIG_BY_TYPE.openboard.filename);
      }
    }
  });
}

/**
 * For a given board, get the board and its subfolders. For example,
 * for the following structure and the root board A:
 *
 *     A
 *    / \
 *   B  C
 *     / \
 *    D   E
 *
 * The output should contain boards A, B, C, D, and E.
 *
 * @param allBoards An array of boards.
 * @param rootBoardId The id of the "main" board that we want to export.
 * @returns {Array<Object>} The board and its subfolders.
 */
function getNestedBoards(allBoards, rootBoardId) {
  const boardsMap = _.fromPairs(_.map(allBoards, b => [b.id, b]));

  const unseen = [rootBoardId];
  const nestedBoardIds = [rootBoardId];

  while (!_.isEmpty(unseen)) {
    const curr = unseen.pop();
    const tiles = _.get(boardsMap[curr], 'tiles');
    _.forEach(tiles, tile => {
      const id = tile.loadBoard;
      // The second check is necessary to handle cycles (for example,
      // A -> B -> A).
      if (id && !_.includes(nestedBoardIds, id)) {
        nestedBoardIds.push(id);
        unseen.push(id);
      }
    });
  }

  return _.map(nestedBoardIds, id => boardsMap[id]);
}

export async function cboardExportAdapter(allBoards = [], board) {
  const boards = board ? getNestedBoards(allBoards, board.id) : allBoards;

  const jsonData = new Blob([JSON.stringify(boards)], {
    type: 'text/json;charset=utf-8;'
  });

  if (jsonData) {
    let prefix = getDatetimePrefix();
    if (boards.length === 1) {
      prefix = prefix + boards[0].name + ' ';
    } else {
      prefix = prefix + 'boardsset ';
    }
    if (isAndroid()) {
      requestCvaWritePermissions();
      const name = 'Download/' + prefix + EXPORT_CONFIG_BY_TYPE.cboard.filename;
      writeCvaFile(name, jsonData);
    }
    // TODO: Can we use `saveAs` here, like in the other adapters?
    // IE11 & Edge
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(
        jsonData,
        prefix + EXPORT_CONFIG_BY_TYPE.cboard.filename
      );
    } else {
      // In FF link must be added to DOM to be clicked
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(jsonData);
      link.setAttribute(
        'download',
        prefix + EXPORT_CONFIG_BY_TYPE.cboard.filename
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export async function pdfExportAdapter(boards = [], intl) {
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [20, 20],
    content: []
  };
  const lastBoardIndex = boards.length - 1;
  const content = await boards.reduce(async (prev, board, i) => {
    const prevContent = await prev;
    const breakPage = i !== lastBoardIndex;
    const boardPDFData = await generatePDFBoard(board, intl, breakPage);
    return prevContent.concat(boardPDFData);
  }, Promise.resolve([]));

  docDefinition.content = content;
  const pdfObj = pdfMake.createPdf(docDefinition);

  if (pdfObj) {
    let prefix = getDatetimePrefix();
    if (content.length === 2) {
      prefix = prefix + content[0] + ' ';
    } else {
      prefix = prefix + 'boardsset ';
    }
    if (isAndroid()) {
      requestCvaWritePermissions();
      pdfObj.getBuffer(buffer => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        const name = 'Download/' + prefix + EXPORT_CONFIG_BY_TYPE.pdf.filename;
        writeCvaFile(name, blob);
      });
    } else {
      // On a browser simply use download!
      pdfObj.download(prefix + EXPORT_CONFIG_BY_TYPE.pdf.filename);
    }
  }
}

export default {
  openboardExportAdapter,
  cboardExportAdapter,
  pdfExportAdapter
};
