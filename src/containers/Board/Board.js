import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import AddBoxIcon from 'material-ui-icons/AddBox';
import SettingsIcon from 'material-ui-icons/Settings';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import LockOutlineIcon from 'material-ui-icons/LockOutline';
import LockOpenIcon from 'material-ui-icons/LockOpen';

import {
  changeBoard,
  previousBoard,
  addBoard,
  addSymbol,
  deleteSymbols,
  editSymbols
} from './actions';
import { showNotification } from '../Notifications/actions';
import speech from '../../speech';
import messages from './messages';
import SymbolDetails from './SymbolDetails';
import Settings from '../Settings';
import Grid from '../Grid';
import Output from './Output';
import Toolbar from './Toolbar';
import EditToolbar from './EditToolbar';

import './Board.css';

export class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      output: [],
      selectedSymbols: [],
      isSelecting: false,
      isLocked: true,
      symbolDetailsOpen: false,
      settingsOpen: false
    };
  }

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
      selectedSymbols: []
    }));
  }

  selectSymbol(symbolId) {
    this.setState({
      selectedSymbols: [...this.state.selectedSymbols, symbolId]
    });
  }

  deselectSymbol(symbolId) {
    const [...selectedSymbols] = this.state.selectedSymbols;
    const symbolIndex = selectedSymbols.indexOf(symbolId);
    selectedSymbols.splice(symbolIndex, 1);
    this.setState({ selectedSymbols });
  }

  toggleSymbolSelect(symbol) {
    const symbolId = symbol.id;

    if (symbol.isSelected) {
      this.deselectSymbol(symbolId);
    } else {
      this.selectSymbol(symbolId);
    }
  }

  handleSymbolClick = symbol => {
    const { changeBoard } = this.props;

    if (this.state.isSelecting) {
      this.toggleSymbolSelect(symbol);
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
        this.speak(intl.formatMessage({ id: symbol.text || symbol.label }));
    }
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
      symbolDetailsOpen: true,
      selectedSymbols: [],
      isSelecting: false
    });
  };

  handleEditClick = () => {
    this.setState({ symbolDetailsOpen: true });
  };

  handleDeleteClick = () => {
    const { deleteSymbols, board } = this.props;
    this.setState({ selectedSymbols: [] });
    deleteSymbols(this.state.selectedSymbols, board.id);
  };

  handleSymbolDetailsCancel = () => {
    this.setState({ symbolDetailsOpen: false });
  };

  handleEditSymbolDetailsSubmit = symbols => {
    const { board, editSymbols } = this.props;
    editSymbols(symbols, board.id);
    this.toggleSelectMode();
  };

  handleAddSymbolDetailsSubmit = symbol => {
    const { addSymbol, addBoard, board } = this.props;
    if (symbol.type === 'folder') {
      addBoard(symbol.label);
    }
    addSymbol(symbol, board.id);
  };

  handleLockClick = () => {
    this.setState((state, props) => ({ isLocked: !state.isLocked }));
  };

  generateSymbols(symbols, boardId) {
    return Object.keys(symbols).map((id, index) => {
      const symbol = symbols[id];
      symbol.key = `${boardId}.${id}`;
      symbol.isSelected = this.state.selectedSymbols.includes(symbol.id);

      const { type, label, img, key, isSelected } = symbol;

      const symbolClasses = classNames({
        Symbol: true,
        'Symbol--folder': type === 'folder',
        'is-selected': isSelected
      });

      return (
        <button
          key={key}
          className={symbolClasses}
          onClick={() => {
            this.handleSymbolClick(symbol);
          }}
        >
          {img && (
            <div className="Symbol__container">
              <img className="Symbol__image" src={img} alt="" />
            </div>
          )}
          <div className="Symbol__label">
            <FormattedMessage id={label} />
          </div>
          {isSelected && <CheckCircleIcon className="CheckCircleIcon" />}
        </button>
      );
    });
  }

  render() {
    const { board, navigationHistory, dir, intl } = this.props;
    const symbols = this.generateSymbols(board.symbols, board.id);

    return (
      <div
        className={classNames(
          {
            'is-selecting': this.state.isSelecting,
            'is-locked': this.state.isLocked
          },
          'Board'
        )}
      >
        <Output
          className="Board__output"
          values={this.state.output}
          onClick={this.handleOutputClick}
          onClearClick={this.handleOutputClearClick}
          onBackspaceClick={this.handleOutputBackspaceClick}
          dir={dir}
        />

        <Toolbar className="Board__toolbar" title={board.id}>
          <div className="Toolbar__group Toolbar__group--start">
            <IconButton
              className="back-button"
              aria-label={intl.formatMessage(messages.back)}
              title={intl.formatMessage(messages.back)}
              disabled={
                navigationHistory.length === 1 || this.state.isSelecting
              }
              onClick={this.handleBackClick}
              color="contrast"
              style={{
                opacity:
                  navigationHistory.length === 1 || this.state.isSelecting
                    ? 0.3
                    : 1
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
          <div className="Toolbar__group Toolbar__group--end">
            <IconButton
              aria-label={intl.formatMessage(messages.lock)}
              title={intl.formatMessage(messages.lock)}
              color="contrast"
              onClick={this.handleLockClick}
            >
              {this.state.isLocked ? <LockOutlineIcon /> : <LockOpenIcon />}
            </IconButton>
          </div>
        </Toolbar>
        <EditToolbar className="Board__edit-toolbar">
          <div className="Toolbar__group Toolbar__group--start">
            <Button color="contrast" onClick={this.handleSelectClick}>
              {!this.state.isSelecting && (
                <FormattedMessage {...messages.select} />
              )}
              {this.state.isSelecting && (
                <FormattedMessage {...messages.cancel} />
              )}
            </Button>
          </div>
          <div className="Toolbar__group Toolbar__group--end">
            <IconButton
              aria-label={intl.formatMessage(messages.delete)}
              title={intl.formatMessage(messages.delete)}
              disabled={!this.state.selectedSymbols.length}
              onClick={this.handleDeleteClick}
              color="contrast"
              style={{
                opacity: this.state.selectedSymbols.length ? 1 : 0.3
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              aria-label={intl.formatMessage(messages.edit)}
              title={intl.formatMessage(messages.edit)}
              disabled={!this.state.selectedSymbols.length}
              onClick={this.handleEditClick}
              color="contrast"
              style={{
                opacity: this.state.selectedSymbols.length ? 1 : 0.3
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label={intl.formatMessage(messages.add)}
              title={intl.formatMessage(messages.add)}
              color="contrast"
              onClick={this.handleAddClick}
            >
              <AddBoxIcon />
            </IconButton>
            <IconButton
              aria-label={intl.formatMessage(messages.settings)}
              title={intl.formatMessage(messages.settings)}
              color="contrast"
              onClick={this.handleSettingsClick}
            >
              <SettingsIcon />
            </IconButton>
          </div>
        </EditToolbar>
        <div
          className="Board__symbols"
          ref={ref => {
            this.boardSymbols = ref;
          }}
        >
          <Grid id={board.id} edit={this.state.isSelecting}>
            {symbols}
          </Grid>
        </div>

        <SymbolDetails
          editingSymbols={this.state.selectedSymbols.map(s => board.symbols[s])}
          open={this.state.symbolDetailsOpen}
          onCancel={this.handleSymbolDetailsCancel}
          onEditSubmit={this.handleEditSymbolDetailsSubmit}
          onAddSubmit={this.handleAddSymbolDetailsSubmit}
        />
        <Settings
          open={this.state.settingsOpen}
          onCancel={this.handleSettingsCancel}
        />
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string,
    symbols: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        type: PropTypes.string,
        label: PropTypes.string,
        text: PropTypes.string,
        img: PropTypes.string
      })
    )
  }),
  navigationHistory: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string
};

Board.defaultProps = {
  className: ''
};

const mapStateToProps = state => {
  const {
    board: { boards, activeBoardId, navigationHistory },
    language: { dir }
  } = state;
  const board = boards.find(board => board.id === activeBoardId);

  return {
    board,
    navigationHistory,
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
    editSymbols: (symbols, boardId) => dispatch(editSymbols(symbols, boardId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Board));
