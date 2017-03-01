require('../../styles/Board.css');
require('../../styles/Button.css');

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');
import React from 'react';
import classNames from 'classnames';
import Button from '../../components/Button';

import { injectIntl, FormattedMessage } from 'react-intl';

import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import { throttle, clone } from 'lodash';

import Output from './Output';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.onResize = throttle(this.onResize, 300);


    this.state = {
      activeBoard: {},
      outputValue: null,
      layouts: null,
      cols: { lg: 10, md: 8, sm: 6, xs: 4, xxs: 3 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 375, xxs: 0 },
      rowHeight: 0,
      edit: false
    };
  }

  buttonTypes = {
    LINK: 'link',
    BUTTON: 'button'
  };

  history = [];

  componentWillMount() {
    this.activateBoard(this.props.homeBoard);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.setRowHeight();
  }

  componentWillReceiveProps(nextProps) {
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

    const activeBoard = this.props.boards.find(board => board.id === id);
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
      return { x: index % cols, y: Math.floor(index / cols), w: 1, h: 1, i: this.state.activeBoard.id + '.' + button.label };
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
    return this.state.activeBoard.buttons.map((button) => {
      const {img, label} = button;
      const key = this.state.activeBoard.id + '.' + label;
      const buttonClasses = classNames({
        'button--link': button.link
      });

      return (
        <button key={key} className={`button mdc-ripple-surface ${buttonClasses}`} onClick={() => { this.onButtonClick(button) }}>
          {img && <div className="button__symbol"><img className="button__image" src={img} /></div>}
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

        rowHeight = (this.gridContainer.offsetWidth - spaceBetween) / cols;
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

  render() {
    const boardClasses = classNames({
      'board': true,
      'is-editing': this.state.edit
    });

    const layouts = this.getLayouts();
    return (
      <div className={boardClasses}>
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
              <Button onClick={this.onAddClick}><i className="material-icons">add</i></Button>
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
