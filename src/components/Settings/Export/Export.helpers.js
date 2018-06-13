import JSZip from 'jszip';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import {
  EXPORT_CONFIG_BY_TYPE,
  CBOARD_OBF_CONSTANTS,
  CBOARD_COLUMNS,
  CBOARD_EXT_PREFIX,
  CBOARD_EXT_PROPERTIES,
  CBOARD_ZIP_OPTIONS
} from './Export.constants';

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
    data: ab,
    content_type: contentType
  };
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
        let imageResponse = null;
        let url = '';
        let contentType = '';
        let fetchedImageID = `custom/${board.name ||
          board.nameKey}/${tile.label || tile.labelKey || tile.id}`;

        if (tile.image.startsWith('data:')) {
          imageResponse = getBase64Image(tile.image);
          contentType = imageResponse['content_type'];
          const defaultExtension =
            contentType.indexOf('/') >= 0 ? contentType.split('/')[1] : '';
          fetchedImageID = defaultExtension.length
            ? `${fetchedImageID}.${defaultExtension}`
            : fetchedImageID;
          url = `/${fetchedImageID}`;
        } else {
          url = tile.image.startsWith('/') ? tile.image : `/${tile.image}`;
          fetchedImageID = tile.image;
          try {
            imageResponse = await axios({
              method: 'get',
              url,
              responseType: 'arraybuffer'
            });

            contentType = imageResponse.headers['content-type'];
          } catch (e) {}
        }

        if (imageResponse) {
          const imageID = `${board.id}_${tile.image}`;
          fetchedImages[fetchedImageID] = imageResponse;
          button['image_id'] = imageID;
          images[imageID] = {
            id: imageID,
            path: `images${url}`,
            content_type: contentType,
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

function getPDFTileData(tile, intl) {
  const label = tile.label || tile.labelKey || '';
  return {
    label: label.length ? intl.formatMessage({ id: label }) : label,
    image: tile.image || ''
  };
}

async function toDataURL(url, outputFormat = 'image/jpeg') {
  return new Promise(resolve => {
    imageElement.crossOrigin = 'Anonymous';
    imageElement.onload = function() {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
    };
    imageElement.src = url;
    if (imageElement.complete || imageElement.complete === undefined) {
      imageElement.src = url;
    }
  });
}

async function generatePDFBoard(board, intl) {
  const header = {
    text: intl.formatMessage({ id: board.nameKey || board.id })
  };

  const table = {
    table: {
      widths: '16%',
      body: [{}]
    },
    layout: 'noBorders',
    pageBreak: 'after'
  };

  if (!board.tiles || !board.tiles.length) {
    return [header, table];
  }

  // Do a grid with 2n rows
  const grid = new Array(Math.ceil(board.tiles.length / CBOARD_COLUMNS) * 2);
  let currentRow = 0;

  await board.tiles.reduce(async (prev, tile, i) => {
    // Wait for previous tile
    await prev;

    const { label, image } = getPDFTileData(tile, intl);
    currentRow =
      i >= (currentRow + 1) * CBOARD_COLUMNS ? currentRow + 1 : currentRow;
    const fixedRow = currentRow * 2;
    let imageData = '';

    if (image && image.length) {
      let dataURL = image;
      if (
        !image.startsWith('data:') ||
        image.startsWith('data:image/svg+xml')
      ) {
        let url = image.startsWith('http') ? image : `/${image}`;
        if (image.startsWith('data:image/svg+xml')) {
          url = image;
        }
        dataURL = await toDataURL(url);
      }

      imageData = {
        image: dataURL,
        width: 100
      };
    }

    const labelData = {
      text: label,
      alignment: 'center'
    };

    if (grid[fixedRow]) {
      grid[fixedRow].push(labelData);
      grid[fixedRow + 1].push(imageData);
    } else {
      grid[fixedRow] = [labelData];
      grid[fixedRow + 1] = [imageData];
    }

    return grid;
  }, Promise.resolve());

  const lastGridRowDiff = CBOARD_COLUMNS - grid[grid.length - 2].length; // labels row
  if (lastGridRowDiff > 0) {
    const emptyCells = new Array(lastGridRowDiff).fill('');
    grid[grid.length - 2] = grid[grid.length - 2].concat(emptyCells); // labels
    grid[grid.length - 1] = grid[grid.length - 1].concat(emptyCells); // images
  }

  table.table.body = grid;

  return [header, table];
}

export async function pdfExportAdapter(boards = [], intl) {
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    content: []
  };

  const content = await boards.reduce(async (prev, board) => {
    const prevContent = await prev;
    const boardPDFData = await generatePDFBoard(board, intl);
    return prevContent.concat(boardPDFData);
  }, Promise.resolve([]));

  docDefinition.content = content;

  pdfMake.createPdf(docDefinition).download(EXPORT_CONFIG_BY_TYPE.pdf.filename);
}
