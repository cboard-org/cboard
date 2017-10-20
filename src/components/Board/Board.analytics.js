import {
  IMPORT_BOARDS,
  ADD_BOARD,
  LOAD_BOARD,
  ADD_BOARD_BUTTON,
  DELETE_BOARD_BUTTONS,
  EDIT_BOARD_BUTTONS
} from './Board.constants';

const importBoards = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Backup',
  eventAction: 'Import Boards'
});

const loadBoard = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Navigation',
  eventAction: 'Load Board',
  eventLabel: action.boardId
});

const addBoard = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Editing',
  eventAction: 'Added Board',
  eventLabel: action.boardName
});

const addBoardButton = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Editing',
  eventAction: 'Added Board Button',
  eventLabel: action.button.label
});

const deleteBoardButtons = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Editing',
  eventAction: 'Deleted Board Buttons'
});

const editBoardButtons = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Editing',
  eventAction: 'Edited Board Buttons'
});

const eventsMap = {
  [IMPORT_BOARDS]: importBoards,
  [ADD_BOARD]: addBoard,
  [LOAD_BOARD]: loadBoard,
  [ADD_BOARD_BUTTON]: addBoardButton,
  [DELETE_BOARD_BUTTONS]: deleteBoardButtons,
  [EDIT_BOARD_BUTTONS]: editBoardButtons
};

export default eventsMap;
