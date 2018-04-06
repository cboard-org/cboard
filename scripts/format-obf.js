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
    source_url: 'https://github.com/cboard-org/cboard',
    author_name: 'Shay Cojocaru',
    author_url: 'https://github.com/shayc',
    author_email: 'shayc@outlook.com'
  }
};

function formatOBF(boards) {
  return boards.map(board => {
    const { id, buttons } = board;
    const name = id;
    return formatBoard(id, name, buttons);
  });
}

function formatBoard(id, name, buttons) {
  let buttonsAndImages = formatButtonsAndImages(buttons);
  return { id, name, ...boardMeta, ...buttonsAndImages };
}

function formatButtonsAndImages(symbols) {
  const images = [];

  const buttons = symbols.map(symbol => {
    const button = {
      id: symbol.id,
      label: symbol.label,
      background_color: symbol.loadBoard ? colors.folder : colors.symbol
    };

    if (symbol.loadBoard) {
      button.load_board = {
        id: symbol.loadBoard
      };
    }

    if (symbol.img) {
      const imageId = shortid.generate();
      const filename = symbol.img.replace('images/mulberry-symbols/', '');
      const image = {
        id: imageId,
        content_type: 'image/svg+xml',
        symbol: {
          set: 'mulberry',
          filename
        }
      };

      button.image_id = imageId;
      images.push(image);
    }
    return button;
  });

  return { buttons, images };
}

const formattedOBF = JSON.stringify(formatOBF(boards.advanced));
fs.writeFile(`./src/api/boards.obf.json`, formattedOBF);
