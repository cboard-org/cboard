import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Board from './Board.component';

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

export class BoardContainer extends PureComponent {
  static propTypes = {
    /**
     * Board direction
     */
    dir: PropTypes.string,
    /**
     * Board navigation history stack
     */
    navHistory: PropTypes.arrayOf(PropTypes.string),
    /**
     * Active board to display
     */
    board: PropTypes.shape({
      id: PropTypes.string,
      symbols: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * Load board
     */
    changeBoard: PropTypes.func,
    /**
     * Load previous board
     */
    previousBoard: PropTypes.func,
    /**
     * Add board
     */
    addBoard: PropTypes.func,
    /**
     * Add symbol
     */
    addSymbol: PropTypes.func,
    /**
     * Edit symbols
     */
    editSymbols: PropTypes.func,
    /**
     * Delete symbols
     */
    deleteSymbols: PropTypes.func,
    /**
     * Focuses a board button
     */
    focusBoardButton: PropTypes.func
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
  const { board, language } = state;
  const activeBoardId = board.activeBoardId;

  return {
    board: board.boards.find(board => board.id === activeBoardId),
    navHistory: board.navHistory,
    dir: language.dir
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
