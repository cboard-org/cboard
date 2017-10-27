import {
  IMPORT_BOARDS,
  CHANGE_BOARD,
  PREVIOUS_BOARD,
  ADD_BOARD,
  ADD_BOARD_BUTTON,
  DELETE_BOARD_BUTTONS,
  EDIT_BOARD_BUTTONS,
  FOCUS_BOARD_BUTTON,
  CHANGE_OUTPUT
} from './Board.constants';

export function importBoards(boards) {
  return {
    type: IMPORT_BOARDS,
    boards
  };
}

export function addBoard(boardId, boardName, boardNameKey) {
  return {
    type: ADD_BOARD,
    boardId,
    boardName,
    boardNameKey
  };
}

export function changeBoard(boardId) {
  return {
    type: CHANGE_BOARD,
    boardId
  };
}

export function previousBoard() {
  return {
    type: PREVIOUS_BOARD
  };
}

export function addBoardButton(button, boardId) {
  return {
    type: ADD_BOARD_BUTTON,
    button,
    boardId
  };
}

export function deleteBoardButtons(buttons, boardId) {
  return {
    type: DELETE_BOARD_BUTTONS,
    buttons,
    boardId
  };
}

export function editBoardButtons(buttons, boardId) {
  return {
    type: EDIT_BOARD_BUTTONS,
    buttons,
    boardId
  };
}

export function focusBoardButton(buttonId, boardId) {
  return {
    type: FOCUS_BOARD_BUTTON,
    buttonId,
    boardId
  };
}

export function changeOutput(output) {
  return {
    type: CHANGE_OUTPUT,
    output
  };
}
