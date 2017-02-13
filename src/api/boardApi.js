import _ from 'lodash';
import boardsData from './boardData';
import mulberrySymbols from './mulberry-symbols.json';

var boardApi = {
    getAllBoards: function () {
        return _.clone(boardsData.boards);
    },

    getSymbols: function () {
        return mulberrySymbols;
    },
    getBoardById: function () { },

    saveBoard: function () { },

    deleteBoard: function () { }
};

export default boardApi;