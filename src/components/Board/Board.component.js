import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';

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
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Board to display
     */
    board: PropTypes.shape({
      id: PropTypes.string,
      buttons: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * Board navigation history -- Todo: doesn't belong here needed in the container - refactor
     */
    navHistory: PropTypes.arrayOf(PropTypes.string),
    /**
     * Callback fired when a board is added
     */
    onAddBoard: PropTypes.func,
    /**
     * Callback fired when a board button is added
     */
    onAddBoardButton: PropTypes.func,
    /**
     * Callback fired when board buttons were edited
     */
    onEditBoardButtons: PropTypes.func,
    /**
     * Callback fired when board buttons are deleted
     */
    onDeleteBoardButtons: PropTypes.func,
    /**
     * Callback fired when requesting to load a board
     */
    onRequestLoadBoard: PropTypes.func,
    /**
     * Callback fired when requesting to load previous board
     */
    onRequestPreviousBoard: PropTypes.func,
    /**
     * Callback fired when a board button is focuesd
     */
    onFocusBoardButton: PropTypes.func
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

  toggleSelectMode() {
    this.setState(prevState => ({
      isSelecting: !prevState.isSelecting,
      selectedButtons: []
    }));
  }

  selectBoardButton(buttonId) {
    this.setState({
      selectedButtons: [...this.state.selectedButtons, buttonId]
    });
  }

  deselectBoardButton(buttonId) {
    const [...selectedButtons] = this.state.selectedButtons;
    const buttonIndex = selectedButtons.indexOf(buttonId);
    selectedButtons.splice(buttonIndex, 1);
    this.setState({ selectedButtons });
  }

  toggleBoardButtonSelect(buttonId) {
    if (this.state.selectedButtons.includes(buttonId)) {
      this.deselectBoardButton(buttonId);
    } else {
      this.selectBoardButton(buttonId);
    }
  }

  handleBoardButtonClick = button => {
    const { onRequestLoadBoard } = this.props;

    if (this.state.isSelecting) {
      this.toggleBoardButtonSelect(button.id);
      return;
    }

    if (button.loadBoard) {
      this.boardButtons.scrollTop = 0;
      onRequestLoadBoard(button.loadBoard);
    } else {
      this.outputPush(button);
      this.speak(button.vocalization || button.label);
    }
  };

  handleBoardButtonFocus = buttonId => {
    const { onFocusBoardButton, board } = this.props;
    onFocusBoardButton(buttonId, board.id);
  };

  handleOutputClick = button => {
    const reducedOutput = this.state.output.reduce(
      (output, value) => output + (value.vocalization || value.label) + ' ',
      ''
    );
    this.cancelSpeak();
    this.speak(reducedOutput);
  };

  handleOutputChange = output => {
    this.cancelSpeak();
    this.setState({ output });
  };

  handleSettingsClick = () => {
    this.setState({ settingsOpen: true });
  };

  handleSettingsCancel = () => {
    this.setState({ settingsOpen: false });
  };

  handleBackClick = () => {
    const { onRequestPreviousBoard } = this.props;
    onRequestPreviousBoard();
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
    const { onDeleteBoardButtons, board } = this.props;
    this.setState({ selectedButtons: [] });
    onDeleteBoardButtons(this.state.selectedButtons, board.id);
  };

  handleBoardButtonDetailsCancel = () => {
    this.setState({ boardButtonDetailsOpen: false });
  };

  handleEditBoardButtonDetailsSubmit = buttons => {
    const { board, onEditBoardButtons } = this.props;
    onEditBoardButtons(buttons, board.id);
    this.toggleSelectMode();
  };

  handleAddBoardButtonDetailsSubmit = button => {
    const { onAddBoardButton, onAddBoard, board } = this.props;
    if (button.loadBoard) {
      onAddBoard(button.loadBoard);
    }
    onAddBoardButton(button, board.id);
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

  generateBoardButtons(boardButtons, boardId) {
    const { focusedBoardButtonId } = this.props.board;

    return Object.keys(boardButtons).map((id, index) => {
      const button = boardButtons[id];
      const isSelected = this.state.selectedButtons.includes(button.id);
      const hasFocus = focusedBoardButtonId
        ? button.id === focusedBoardButtonId
        : index === 0;
      const label = this.props.intl.formatMessage({ id: button.label });
      return (
        <div key={button.id}>
          <BoardButton
            {...button}
            label={label}
            hasFocus={hasFocus}
            onClick={this.handleBoardButtonClick}
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
    const boardButtons = this.generateBoardButtons(board.buttons, board.id);

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
          onChange={this.handleOutputChange}
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
          className="Board__buttons"
          onKeyUp={this.handleBoardKeyUp}
          ref={ref => {
            this.boardButtons = ref;
          }}
        >
          <Grid id={board.id} edit={this.state.isSelecting}>
            {boardButtons}
          </Grid>
        </div>

        <BoardButtonDetails
          editingBoardButtons={this.state.selectedButtons.map(
            selectedBoardButtonId =>
              board.buttons.filter(boardButton => {
                return boardButton.id === selectedBoardButtonId;
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

export default injectIntl(Board);
