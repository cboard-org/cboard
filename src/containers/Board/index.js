require('../../styles/Board.css');
require('../../styles/Button.css');

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');
import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import mulberrySymbols from '../../api/mulberry-symbols';

import { injectIntl, FormattedMessage } from 'react-intl';

import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import { throttle, clone } from 'lodash';

import Button from '../../components/Button';
import Output from './Output';
import AddButton from './AddButton';

class Board extends PureComponent {
  constructor(props) {
    super(props);
    this.onResize = throttle(this.onResize, 300);

    // const boards = JSON.parse(window.localStorage.getItem('boards')) || clone(this.props.boards);
    const boards = [this.generateBoardAllSymols(2000, 3000)];

    this.state = {
      activeBoard: {},
      outputValue: null,
      layouts: null,
      cols: { lg: 10, md: 8, sm: 6, xs: 6, xxs: 4 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 567, xxs: 0 },
      rowHeight: 0,
      edit: false,
      showAddButton: false,
      boards: boards
    };

    this.version = '0.02';

    this.buttonTypes = {
      LINK: 'link',
      BUTTON: 'button'
    };

    this.history = [];
  }

  componentWillMount() {

    this.activateBoard(this.props.homeBoard);

    requestAnimationFrame(() => {
      this.cacheBust(this.version);
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.setRowHeight();
  }

  componentWillReceiveProps(nextProps) {
  }

  cacheBust(version) {
    const shouldBust = Number(getFromLS('version')) !== Number(version);
    if (shouldBust) {
      // todo seperation
      localStorage.clear();
      saveToLS('version', version);
    }
  }

  getLayoutsLocalStorage() {
    const layouts = getFromLS(this.state.activeBoard.id) || {};
    return layouts;
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

  generateLayout(cols) {
    return this.state.activeBoard.buttons.map((button, index) => {
      return { x: index % cols, y: Math.floor(index / cols), w: 1, h: 1, i: this.state.activeBoard.id + '.' + index };
    });
  }

  generateLayouts(breakpoints) {
    const layouts = {};
    for (let breakpoint in breakpoints) {
      layouts[breakpoint] = this.generateLayout(this.state.cols[breakpoint]);
    }
    return layouts;
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
          className={`button mdc-ripple-surface ${buttonClasses}`}
          onClick={() => { this.onButtonClick(button) }}>

          {img && <div className="button__symbol">
            <img className="button__image" src={img} />
          </div>}
          {label}
          <span className="button__label"><FormattedMessage id={label} /></span>
        </button>
      )
    });
  }

  setRowHeight() {
    const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];
    let rowHeight;

    for (let breakpoint of breakpoints) {
      if (window.matchMedia('(min-width: ' + this.state.breakpoints[breakpoint] + 'px)').matches) {
        const cols = this.state.cols[breakpoint];
        const padding = 10 * (cols - 1);
        const margin = 10 * 2;
        const spaceBetween = margin + padding;

        const gridWidth = ReactDOM.findDOMNode(this.rrgl).offsetWidth;
        rowHeight = (gridWidth - spaceBetween) / cols;
        break;
      }
    }
    this.setState({ rowHeight });
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

  onLayoutChange = (layout, layouts) => {
    const boardId = this.state.activeBoard.id;
    saveToLS(this.state.activeBoard.id, layouts);
    this.setState({ layouts });
    // this.props.onLayoutChange(layout, layouts);
  }

  onResize = (event) => {
    this.setRowHeight();
  }

  getLayouts() {
    const layoutsLocalStorage = this.getLayoutsLocalStorage();
    const layouts = Object.keys(layoutsLocalStorage).length ? layoutsLocalStorage : this.generateLayouts(this.state.breakpoints);
    return layouts;
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
    this.setState({ boards, activeBoard });
    window.localStorage.setItem('boards', JSON.stringify(boards));
  }

  render() {
    const boardClasses = classNames({
      'board': true,
      'is-editing': this.state.edit
    });

    const layouts = this.getLayouts();
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
              <Button onClick={this.toggleEdit}><FormattedMessage id="done" /></Button>
            </section>
          </div>}
        </div>
        <div className="board__buttons" ref={(ref) => { this.gridContainer = ref }}>
          <ResponsiveReactGridLayout
            className="grid"
            layouts={layouts}
            onLayoutChange={this.onLayoutChange}
            breakpoints={this.state.breakpoints}
            cols={this.state.cols}
            measureBeforeMount={true}
            verticalCompact={true}
            rowHeight={this.state.rowHeight}
            isDraggable={this.state.edit}
            isResizable={this.state.edit}
            ref={(ref) => { this.rrgl = ref }}
          >
            {this.generateButtons()}
          </ResponsiveReactGridLayout>
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  language: React.PropTypes.string,
  boards: React.PropTypes.array.isRequired,
  onOutputClick: React.PropTypes.func,
  onOutputChange: React.PropTypes.func
};

Board.defaultProps = {
  homeBoard: 'home'
};

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(`board.${key}`)) || {};
    } catch (e) {/*Ignore*/ }
  }
  return ls.layouts;
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(`board.${key}`, JSON.stringify({
      layouts: value
    }));
  }
}

export default injectIntl(Board);
