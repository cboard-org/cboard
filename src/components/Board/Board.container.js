import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Board from './Board';

import {
  changeBoard,
  previousBoard,
  addBoard,
  addSymbol,
  deleteSymbols,
  editSymbols,
  focusBoardButton
} from './Board.actions';
import { showNotification } from '../Notifications/Notifications.actions';
import speech from '../../speech';

export class BoardContainer extends Component {
  static propTypes = {
    dir: PropTypes.string,
    navHistory: PropTypes.arrayOf(PropTypes.string),
    board: PropTypes.shape({
      id: PropTypes.string,
      symbols: PropTypes.arrayOf(PropTypes.object)
    }),
    changeBoard: PropTypes.func,
    previousBoard: PropTypes.func,
    addBoard: PropTypes.func,
    addSymbol: PropTypes.func,
    editSymbols: PropTypes.func,
    deleteSymbols: PropTypes.func
  };

  render() {
    const {
      dir,
      navHistory,
      board,
      changeBoard,
      previousBoard,
      addBoard,
      addSymbol,
      editSymbols,
      deleteSymbols,
      focusBoardButton
    } = this.props;

    return (
      <Board
        board={board}
        navHistory={navHistory}
        dir={dir}
        onRequestChangeBoard={changeBoard}
        onRequestPreviousBoard={previousBoard}
        onAddBoard={addBoard}
        onAddSymbol={addSymbol}
        onEditSymbols={editSymbols}
        onDeleteSymbols={deleteSymbols}
        onFocusBoardButton={focusBoardButton}
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    board: { boards, activeBoardId, navHistory },
    language: { dir }
  } = state;

  const board = boards.find(board => board.id === activeBoardId);
  return {
    board,
    navHistory,
    dir,
    speech
  };
};

const mapDispatchToProps = dispatch => ({
  changeBoard: boardId => dispatch(changeBoard(boardId)),
  previousBoard: () => dispatch(previousBoard()),
  addBoard: boardId => dispatch(addBoard(boardId)),
  addSymbol: (symbol, boardId) => {
    dispatch(addSymbol(symbol, boardId));
    dispatch(showNotification('Symbol added'));
  },
  deleteSymbols: (symbols, boardId) => {
    dispatch(deleteSymbols(symbols, boardId));
    dispatch(showNotification('Symbol deleted'));
  },
  editSymbols: (symbols, boardId) => dispatch(editSymbols(symbols, boardId)),
  focusBoardButton: (symbolId, boardId) =>
    dispatch(focusBoardButton(symbolId, boardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
