import {
  IMPORT_BOARDS,
  ADD_BOARD,
  CHANGE_BOARD,
  ADD_BOARD_BUTTON,
  DELETE_BOARD_BUTTONS,
  EDIT_BOARD_BUTTONS
} from './Board.constants';

const getButtons = (boards, boardId, buttonsId) => {
  const board = boards.find(board => board.id === boardId);

  const buttons = board.buttons
    .filter(button => buttonsId.includes(button.id))
    .reduce(
      (acc, button) => (acc ? `${acc}, ${button.label}` : button.label),
      ''
    );
  return buttons;
};

const importBoards = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Backup',
  eventAction: 'Import Boards'
});

const changeBoard = (action, prevState, nextState) => {
  const boardName = nextState.board.present.boards.find(
    board => board.id === action.boardId
  ).nameKey;

  return {
    hitType: 'event',
    eventCategory: 'Navigation',
    eventAction: 'Change Board',
    eventLabel: boardName
  };
};

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

const deleteBoardButtons = (action, prevState, nextState) => {
  const deletedButtons = getButtons(
    prevState.board.present.boards,
    action.boardId,
    action.buttons
  );

  return {
    hitType: 'event',
    eventCategory: 'Editing',
    eventAction: 'Deleted Board Buttons',
    eventLabel: deletedButtons
  };
};

const editBoardButtons = (action, prevState, nextState) => {
  const editedButtons = action.buttons.reduce(
    (acc, button) => (acc ? `${acc}, ${button.label}` : button.label),
    ''
  );
  return {
    hitType: 'event',
    eventCategory: 'Editing',
    eventAction: 'Edited Board Buttons',
    eventLabel: editedButtons
  };
};

const eventsMap = {
  [IMPORT_BOARDS]: importBoards,
  [ADD_BOARD]: addBoard,
  [CHANGE_BOARD]: changeBoard,
  [ADD_BOARD_BUTTON]: addBoardButton,
  [DELETE_BOARD_BUTTONS]: deleteBoardButtons,
  [EDIT_BOARD_BUTTONS]: editBoardButtons
};

export default eventsMap;
