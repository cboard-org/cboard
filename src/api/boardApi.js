import _ from 'lodash';
import boardsData from './boardData';
import mulberrySymbols from './mulberry-symbols.json';

const boardApi = {
  getAllBoards() {
    return _.clone(boardsData.boards);
  },

  getSymbols() {
    return mulberrySymbols;
  },
  getBoardById() { },

  saveBoard() { },

  deleteBoard() { },
};

export default boardApi;
