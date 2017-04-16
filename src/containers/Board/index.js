require('../../styles/Board.css');
require('../../styles/Button.css');

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { injectIntl, FormattedMessage } from 'react-intl';

import { clone } from 'lodash';

import mulberrySymbols from '../../api/mulberry-symbols';
import Button from '../../components/Button';
import Output from './Output';
import Grid from './Grid';
import AddButton from './AddButton';

class Board extends PureComponent {
  constructor(props) {
    super(props);
    const boards = JSON.parse(window.localStorage.getItem('boards')) || clone(this.props.boards);

    this.state = {
      activeBoard: {},
      outputValue: null,
      edit: false,
      showAddButton: false,
      boards: boards
    };

    this.version = '0.01';

    this.buttonTypes = {
      LINK: 'link',
      BUTTON: 'button'
    };

    this.history = [];
  }

  componentWillMount() {
    this.activateBoard(this.props.homeBoard);
  }

  activateBoard(id, history = true) {

    if (typeof id !== 'string') {
      throw (new Error('id must be of type string'));
    }

    if (history && this.state.activeBoard.id) {
      this.history.push(this.state.activeBoard.id);
    }

    const activeBoard = this.state.boards.find(board => board.id === id);
    this.setState({ activeBoard });
  }

  valueToString = (value) => {
    const message = value.text || value.label;
    return this.props.intl.formatMessage({ id: message });
  }

  outputToString(output) {
    return output.map(this.valueToString).join(' ');
  }

  setOutputValue(value) {
    this.setState({ outputValue: value });
    const text = this.valueToString(value);
    this.props.onOutputChange(text);
  }

  generateButtons() {
    return this.state.activeBoard.buttons.map((button, index) => {
      const { img, label } = button;
      const key = this.state.activeBoard.id + '.' + index;
      const buttonClasses = classNames({
        'button--link': button.link
      });

      return (
        <button
          key={key}
          className={`button ${buttonClasses}`}
          onClick={() => { this.onButtonClick(button) }}>

          {img && <div className="button__symbol">
            <img className="button__image" src={img} alt="" />
          </div>}
          <span className="button__label"><FormattedMessage id={label} /></span>
        </button>
      )
    });
  }

  toggleEdit = () => {
    this.setState({ edit: !this.state.edit });
  }

  onBackClick = () => {
    const previousBoard = this.history.pop();
    previousBoard && this.activateBoard(previousBoard, false);
  }

  onButtonClick = (button) => {
    if (this.state.edit) { return; }

    switch (button.type) {
      case this.buttonTypes.LINK:
        this.activateBoard(button.link);
        if (button.output) { this.setOutputValue(button); }
        break;
      case this.buttonTypes.BUTTON:
        this.setOutputValue(button);
        break;
      default:
      // no default
    }
  }

  onOutputClick = (output) => {
    this.props.onOutputClick(this.outputToString(output));
  }

  toggleAddButton = () => {
    this.setState(prevState => {
      return { showAddButton: !prevState.showAddButton };
    });
  }

  // debug symbols
  generateBoardAllSymols(from, to) {
    const boards = {
      id: 'home',
      buttons: []
    }

    const flags = {};
    const symbolSet = mulberrySymbols.filter(symbol => {
      const name = symbol.name.replace(/_|,_to|\d\w?/g, ' ').trim().toLowerCase();
      if (flags[name]) {
        return false;
      }
      flags[name] = true;
      return true;
    });


    for (let i = from; i < to; i++) {
      const symbol = symbolSet[i];
      if (!symbol) { break; }
      const name = symbol.name.replace(/_|, to|\d\w?/g, ' ').trim().toLowerCase();
      const src = symbol.src;
      const button = {
        type: 'button',
        label: name,
        text: '',
        img: src
      }
      boards.buttons.push(button)
    }

    // boards.buttons = symbolSet.map(symbol => {
    //   const name = symbol.name.replace(/_|,_to|\d\w?/g, ' ').trim().toLowerCase();
    //   if (symbol.name.indexOf('a')) {
    //     debugger;
    //   }
    //   const { src } = symbol;
    //   const button = {
    //     type: 'button',
    //     label: name,
    //     text: '',
    //     img: ''
    //   };
    //   return button;
    // });
    return boards;
  }

  handleAddButton = button => {
    const boards = clone(this.state.boards);
    const activeBoard = boards.find(board => {
      return board.id === this.state.activeBoard.id;
    });

    activeBoard.buttons.push(button);

    if (button.type === 'link' && button.link &&
      !boards.find(board => {
        return board.id === button.link;
      })) {
      boards.push({ id: button.link, buttons: [] });
    }
    this.setState({ boards, activeBoard });
    window.localStorage.setItem('boards', JSON.stringify(boards));
  }

  downloadBoards = event => {
    var data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state.boards));
    event.target.href = 'data:' + data;
  }

  render() {
    const boardClasses = classNames({
      'board': true,
      'is-editing': this.state.edit
    });

    return (
      <div className={boardClasses}>
        {this.state.showAddButton && <AddButton
          messages={this.props.messages}
          onAdd={this.handleAddButton}
          onClose={this.toggleAddButton}
        />}
        <div className="board__output">
          <Output value={this.state.outputValue} onOutputClick={this.onOutputClick} />
        </div>

        <div className="board__toolbar">
          {!this.state.edit && <div className="mdc-toolbar">
            <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
              <Button disabled={!this.history.length} onClick={this.onBackClick}><i className="material-icons">arrow_back</i></Button>
            </section>
            <div className="mdc-toolbar__title"><FormattedMessage id={this.state.activeBoard.id} /></div>
            <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
              <Button onClick={this.toggleEdit}><i className="material-icons">mode_edit</i></Button>
            </section>
          </div>}

          {this.state.edit && <div className="mdc-toolbar">
            <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
              <Button onClick={this.toggleAddButton}><i className="material-icons">add</i></Button>
            </section>
            <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
              <a onClick={this.downloadBoards} download="boards.json">download</a>
              <Button onClick={this.toggleEdit}><FormattedMessage id="done" /></Button>
            </section>
          </div>}
        </div>
        <div className="board__buttons" ref={(ref) => { this.gridContainer = ref }}>
          <Grid id={this.state.activeBoard.id} edit={this.state.edit}>
            {this.generateButtons()}
          </Grid>
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  language: PropTypes.string,
  boards: PropTypes.array.isRequired,
  onOutputClick: PropTypes.func,
  onOutputChange: PropTypes.func
};

Board.defaultProps = {
  homeBoard: 'home'
};

export default injectIntl(Board);
