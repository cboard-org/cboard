import { trackEvent } from '@redux-beacon/google-analytics-gtag';

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

const importBoards = trackEvent((action, prevState, nextState) => ({
  category: 'Backup',
  action: 'Import Boards'
}));

const changeBoard = trackEvent((action, prevState, nextState) => {
  const boardName = nextState.board.boards.find(
    board => board.id === action.boardId
  ).nameKey;

  return {
    category: 'Navigation',
    action: 'Change Board',
    label: boardName
  };
});

const addBoard = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Added Board',
  label: action.boardName
}));

const addBoardButton = trackEvent((action, prevState, nextState) => ({
  category: 'Editing',
  action: 'Added Board Button',
  label: action.button.label
}));

const deleteBoardButtons = trackEvent((action, prevState, nextState) => {
  const deletedButtons = getButtons(
    prevState.board.boards,
    action.boardId,
    action.buttons
  );

  return {
    category: 'Editing',
    action: 'Deleted Board Buttons',
    label: deletedButtons
  };
});

const editBoardButtons = trackEvent((action, prevState, nextState) => {
  const editedButtons = action.buttons.reduce(
    (acc, button) => (acc ? `${acc}, ${button.label}` : button.label),
    ''
  );
  return {
    category: 'Editing',
    action: 'Edited Board Buttons',
    label: editedButtons
  };
});

const eventsMap = {
  [IMPORT_BOARDS]: importBoards,
  [ADD_BOARD]: addBoard,
  [CHANGE_BOARD]: changeBoard,
  [ADD_BOARD_BUTTON]: addBoardButton,
  [DELETE_BOARD_BUTTONS]: deleteBoardButtons,
  [EDIT_BOARD_BUTTONS]: editBoardButtons
};

export default eventsMap;
