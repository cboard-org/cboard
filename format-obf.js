const fs = require('fs');
const shortid = require('shortid');
const boards = JSON.parse(fs.readFileSync('./src/api/boards.json', 'utf8'));

const colors = {
  folder: 'rgb(187, 222, 251)',
  symbol: 'rgb(255, 241, 118)'
};

const boardMeta = {
  format: 'open-board-0.1',
  license: {
    type: 'CC-By',
    copyright_notice_url: 'http://creativecommons.org/licenses/by',
    source_url: 'https://github.com/shayc/cboard',
    author_name: 'Shay Cojocaru',
    author_url: 'https://github.com/shayc',
    author_email: 'shayc@outlook.com'
  }
};

function formatOBF(boards) {
  return boards.map(board => formatBoard(board));
}

function formatBoard(board) {
  let buttonsAndImages = formatButtonsAndImages(board.symbols);
  const boardId = board.id;

  return Object.assign(
    {},
    { id: boardId, name: boardId },
    boardMeta,
    buttonsAndImages
  );
}

function formatButtonsAndImages(symbols) {
  const images = [];

  const buttons = symbols.map(symbol => {
    const typeFolder = symbol.boardId;
    const hasImage = symbol.img;

    const button = {
      id: symbol.id,
      label: symbol.label,
      background_color: colors.symbol
    };

    const image = {};

    if (typeFolder) {
      button.background_color = colors.folder;
      button.load_board = {
        id: symbol.boardId
      };
    }

    if (hasImage) {
      const imageId = shortid.generate();
      button.image_id = imageId;

      image.id = imageId;
      image.content_type = 'image/svg+xml';
      image.symbol = {
        set: 'mulberry',
        filename: symbol.img.replace('images/mulberry-symbols/', '')
      };
      images.push(image);
    }
    return button;
  });

  return { buttons, images };
}

const formattedOBF = JSON.stringify(formatOBF(boards.advanced));
fs.writeFile(`./src/api/boards.obf.json`, formattedOBF);
