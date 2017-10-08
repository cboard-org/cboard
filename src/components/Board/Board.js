import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';

import {
  changeBoard,
  previousBoard,
  addBoard,
  addSymbol,
  deleteSymbols,
  editSymbols,
  focusBoardButton
} from './actions';
import { showNotification } from '../Notifications/actions';
import speech from '../../speech';
import BoardButtonDetails from './BoardButtonDetails';
import Settings from '../Settings';
import Grid from '../Grid';
import SymbolOutput from './SymbolOutput';
import Navbar from './Navbar';
import EditToolbar from './EditToolbar';
import BoardButton from './BoardButton';

import './Board.css';

export class Board extends Component {
  static propTypes = {
    className: PropTypes.string,
    intl: intlShape.isRequired,
    board: PropTypes.shape({
      id: PropTypes.string,
      symbols: PropTypes.arrayOf(PropTypes.object)
    }),
    navHistory: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    className: ''
  };

  state = {
    output: [],
    selectedButtons: [],
    isSelecting: false,
    isLocked: true,
    boardButtonDetailsOpen: false,
    settingsOpen: false
  };

  speak = text => {
    if (!text) {
      return;
    }
    speech.speak(text);
  };

  cancelSpeak = () => {
    speech.cancel();
  };

  outputPush(value) {
    this.setState({ output: [...this.state.output, value] });
  }

  outputPop() {
    const [...output] = this.state.output;
    output.pop();
    this.setState({ output });
  }

  toggleSelectMode() {
    this.setState(prevState => ({
      isSelecting: !prevState.isSelecting,
      selectedButtons: []
    }));
  }

  selectSymbol(symbolId) {
    this.setState({
      selectedButtons: [...this.state.selectedButtons, symbolId]
    });
  }

  deselectSymbol(symbolId) {
    const [...selectedButtons] = this.state.selectedButtons;
    const symbolIndex = selectedButtons.indexOf(symbolId);
    selectedButtons.splice(symbolIndex, 1);
    this.setState({ selectedButtons });
  }

  toggleSymbolSelect(symbolId) {
    if (this.state.selectedButtons.includes(symbolId)) {
      this.deselectSymbol(symbolId);
    } else {
      this.selectSymbol(symbolId);
    }
  }

  handleSymbolClick = symbol => {
    const { changeBoard } = this.props;

    if (this.state.isSelecting) {
      this.toggleSymbolSelect(symbol.id);
      return;
    }

    switch (symbol.type) {
      case 'folder':
        this.boardSymbols.scrollTop = 0;
        changeBoard(symbol.boardId);
        break;
      default:
        const { intl } = this.props;
        this.outputPush(symbol);
        this.speak(
          intl.formatMessage({ id: symbol.vocalization || symbol.label })
        );
    }
  };

  handleBoardButtonFocus = symbolId => {
    const { focusBoardButton, board } = this.props;
    focusBoardButton(symbolId, board.id);
  };

  handleOutputClick = symbol => {
    const { intl } = this.props;
    const translatedOutput = this.state.output.reduce(
      (output, value) => output + intl.formatMessage({ id: value.label }) + ' ',
      ''
    );
    this.cancelSpeak();
    this.speak(translatedOutput);
  };

  handleOutputClearClick = () => {
    this.setState({ output: [] });
    this.cancelSpeak();
  };

  handleOutputBackspaceClick = () => {
    this.outputPop();
    this.cancelSpeak();
  };

  handleSettingsClick = () => {
    this.setState({ settingsOpen: true });
  };

  handleSettingsCancel = () => {
    this.setState({ settingsOpen: false });
  };

  handleBackClick = () => {
    const { previousBoard } = this.props;
    previousBoard();
  };

  handleSelectClick = () => {
    this.toggleSelectMode();
  };

  handleAddClick = () => {
    this.setState({
      boardButtonDetailsOpen: true,
      selectedButtons: [],
      isSelecting: false
    });
  };

  handleEditClick = () => {
    this.setState({ boardButtonDetailsOpen: true });
  };

  handleDeleteClick = () => {
    const { deleteSymbols, board } = this.props;
    this.setState({ selectedButtons: [] });
    deleteSymbols(this.state.selectedButtons, board.id);
  };

  handleBoardButtonDetailsCancel = () => {
    this.setState({ boardButtonDetailsOpen: false });
  };

  handleEditBoardButtonDetailsSubmit = buttons => {
    const { board, editSymbols } = this.props;
    editSymbols(buttons, board.id);
    this.toggleSelectMode();
  };

  handleAddBoardButtonDetailsSubmit = button => {
    const { addSymbol, addBoard, board } = this.props;
    if (button.type === 'folder') {
      addBoard(button.label);
    }
    addSymbol(button, board.id);
  };

  handleLockClick = () => {
    this.setState((state, props) => ({
      isLocked: !state.isLocked,
      isSelecting: false,
      selectedButtons: []
    }));
  };

  handleBoardKeyUp = event => {
    if (event.keyCode === keycode('esc')) {
      this.handleBackClick();
    }
  };

  generateSymbols(symbols, boardId) {
    const { focusedBoardButtonSymbolId } = this.props.board;

    return Object.keys(symbols).map((id, index) => {
      const symbol = symbols[id];
      const isSelected = this.state.selectedButtons.includes(symbol.id);
      const hasFocus = focusedBoardButtonSymbolId
        ? symbol.id === focusedBoardButtonSymbolId
        : index === 0;

      return (
        <div key={symbol.id}>
          <BoardButton
            {...symbol}
            hasFocus={hasFocus}
            onClick={this.handleSymbolClick}
            onFocus={this.handleBoardButtonFocus}
          >
            {isSelected && <CheckCircleIcon className="CheckCircleIcon" />}
          </BoardButton>
        </div>
      );
    });
  }

  render() {
    const { dir, navHistory, board } = this.props;
    const symbols = this.generateSymbols(board.symbols, board.id);

    return (
      <div
        className={classNames('Board', {
          'is-selecting': this.state.isSelecting,
          'is-locked': this.state.isLocked
        })}
      >
        <SymbolOutput
          className="Board__output"
          dir={dir}
          values={this.state.output}
          onClick={this.handleOutputClick}
          onClearClick={this.handleOutputClearClick}
          onBackspaceClick={this.handleOutputBackspaceClick}
        />

        <Navbar
          className="Board__navbar"
          title={board.id}
          disabled={navHistory.length === 1 || this.state.isSelecting}
          isLocked={this.state.isLocked}
          onBackClick={this.handleBackClick}
          onLockClick={this.handleLockClick}
        />

        <EditToolbar
          className="Board__edit-toolbar"
          isSelecting={this.state.isSelecting}
          isItemsSelected={!!this.state.selectedButtons.length}
          onSelectClick={this.handleSelectClick}
          onAddClick={this.handleAddClick}
          onEditClick={this.handleEditClick}
          onDeleteClick={this.handleDeleteClick}
          onSettingsClick={this.handleSettingsClick}
        />
        <div
          className="Board__symbols"
          onKeyUp={this.handleBoardKeyUp}
          ref={ref => {
            this.boardSymbols = ref;
          }}
        >
          <Grid id={board.id} edit={this.state.isSelecting}>
            {symbols}
          </Grid>
        </div>

        <BoardButtonDetails
          editingBoardButtons={this.state.selectedButtons.map(
            selectedBoardButtonId =>
              board.symbols.filter(symbol => {
                return symbol.id === selectedBoardButtonId;
              })[0]
          )}
          open={this.state.boardButtonDetailsOpen}
          onRequestClose={this.handleBoardButtonDetailsCancel}
          onEditSubmit={this.handleEditBoardButtonDetailsSubmit}
          onAddSubmit={this.handleAddBoardButtonDetailsSubmit}
        />
        <Settings
          open={this.state.settingsOpen}
          onRequestClose={this.handleSettingsCancel}
        />
      </div>
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

const mapDispatchToProps = dispatch => {
  return {
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Board));
