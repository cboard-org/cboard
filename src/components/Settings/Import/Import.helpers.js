import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import shortid from 'shortid';
import { IMPORT_PATHS, CBOARD_EXT_PREFIX } from './Import.constants';

function toCamelCase(scString = '') {
  const find = /(_\w)/g;
  const convertFn = matches => matches[1].toUpperCase();

  return scString.replace(find, convertFn);
}

export async function cboardImportAdapter(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = event => {
      if (event.target.readyState === 2) {
        try {
          const jsonFile = JSON.parse(reader.result);
          resolve(jsonFile);
        } catch (err) {
          reject(err);
        }
      }
    };
    reader.readAsText(file);
  });
}

async function readZip(file) {
  const zipBlob = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target.readyState === 2) {
        try {
          resolve(new Blob([reader.result]));
        } catch (err) {
          resolve(null);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  });

  if (zipBlob === null) {
    return Promise.reject();
  }

  const filePath = URL.createObjectURL(zipBlob);
  return new Promise(resolve => {
    JSZipUtils.getBinaryContent(filePath, (err, data) => {
      if (err) {
        resolve(err);
      } else {
        resolve(JSZip.loadAsync(data));
      }
    });
  });
}

function obfButtonToCboardButton(button) {
  const cboardButton = {
    id: button.id || shortid.generate(),
    label: button.label || ''
  };

  if (button['background_color']) {
    cboardButton.backgroundColor = button['background_color'];
  }

  if (button['border_color']) {
    cboardButton.borderColor = button['border_color'];
  }

  if (button.vocalization) {
    cboardButton.vocalization = button.vocalization;
  }

  if (button.action) {
    cboardButton.action = button.action;
  }

  return cboardButton;
}

function obfToCboard(obfBoard, boards = {}, images = {}) {
  let tiles = [];

  if (obfBoard.buttons) {
    tiles = obfBoard.buttons.map(button => {
      const tileButton = obfButtonToCboardButton(button);

      if (button['load_board']) {
        const loadBoardData = button['load_board'];
        if (loadBoardData.path && boards[loadBoardData.path]) {
          tileButton.loadBoard = boards[loadBoardData.path].id;
        }
      }

      if (button['image_id']) {
        let imageID = button['image_id'];
        let image = obfBoard.images.find(image => image.id === imageID);

        if (image) {
          if (image['content_type'] && image.path && images[image.path]) {
            tileButton.image = `data:${image['content_type']};base64,${
              images[image.path]
            }`;
          }

          if (image.url) {
            tileButton.image = image.url;
          }

          if (image.data) {
            tileButton.image = image.data;
          }
        }
      }

      const extKeys = Object.keys(button).filter(k =>
        k.startsWith(CBOARD_EXT_PREFIX)
      );
      extKeys.forEach(key => {
        const tileKey = toCamelCase(key.slice(CBOARD_EXT_PREFIX.length));
        tileButton[tileKey] = button[key];
      });

      return tileButton;
    });
  }

  const board = {
    id: obfBoard.id || obfBoard.name || shortid.generate(),
    tiles
  };

  const extKeys = Object.keys(obfBoard).filter(k =>
    k.startsWith(CBOARD_EXT_PREFIX)
  );
  extKeys.forEach(key => {
    const tileKey = toCamelCase(key.slice(CBOARD_EXT_PREFIX.length));
    board[tileKey] = obfBoard[key];
  });

  if (!board.nameKey && obfBoard.name) {
    board.name = obfBoard.name;
  }

  return board;
}

export async function obzImportAdapter(file) {
  const zipFile = await readZip(file);
  if (typeof zipFile !== 'object') {
    throw new Error(zipFile);
  }

  const keys = Object.keys(zipFile.files);
  const boardKeys = keys.filter(
    k => !zipFile.files[k].dir && k.startsWith(IMPORT_PATHS.boards)
  );
  const imageKeys = keys.filter(
    k => !zipFile.files[k].dir && k.startsWith(IMPORT_PATHS.images)
  );

  const boards = {};
  const images = {};

  await Promise.all(
    keys.map(async k => {
      const isBoard = boardKeys.indexOf(k) >= 0;

      if (!isBoard && imageKeys.indexOf(k) < 0) {
        return Promise.resolve();
      }

      const type = isBoard ? 'text' : 'base64';
      let result = null;
      try {
        result = await zipFile.files[k].async(type);

        if (isBoard) {
          boards[k] = JSON.parse(result);
        } else {
          images[k] = result;
        }
      } catch (e) {}

      return result;
    })
  );

  const cboardBoards = [];
  for (let key in boards) {
    cboardBoards.push(obfToCboard(boards[key], boards, images));
  }

  return cboardBoards;
}

export async function obfImportAdapter(file) {
  const reader = new FileReader();
  const jsonFile = await new Promise(resolve => {
    reader.onload = event => {
      if (event.target.readyState === 2) {
        try {
          const jsonFile = JSON.parse(reader.result);
          resolve(jsonFile);
        } catch (err) {
          resolve(err);
        }
      }
    };
    reader.readAsText(file);
  });

  if (typeof jsonFile !== 'object') {
    throw new Error(jsonFile);
  }

  const board = obfToCboard(jsonFile);

  return [board];
}
