require('../../styles/Board.css');
require('../../styles/Button.css');

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');

import React from 'react';
import classNames from 'classnames';

import { injectIntl, FormattedMessage } from 'react-intl';

import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import { throttle } from 'lodash';

import Output from './Output';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.onResize = throttle(this.onResize, 300);

    this.state = {
      activeBoard: {},
      outputValue: {},

      cols: { lg: 6, md: 6, sm: 6, xs: 4, xxs: 3 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 375, xxs: 0 },
      rowHeight: 0,
    };
  }

  buttonTypes = {
    LINK: 'link',
    BUTTON: 'button'
  };

  componentWillMount() {
    this.activateBoard(this.props.homeBoard);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.setRowHeight();
  }

  activateBoard(id) {
    if (typeof id !== 'string') {
      throw (new Error('id must be of type string'))
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
        'button': true,
        'button--link': button.link
      });

      return (
        <button key={key} className={buttonClasses} onClick={() => { this.onButtonClick(button) }}>
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

  onHomeClick = () => {
    this.activateBoard(this.props.homeBoard);
  }

  onButtonClick = (button) => {
    if (this.props.edit) { return; }

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

  onResize = (event) => {
    this.setRowHeight();
  }

  render() {
    const boardClasses = classNames({
      'board': true,
      'is-editing': this.props.edit
    });

    const layouts = this.generateLayouts(this.state.breakpoints);
    return (
      <div className={boardClasses}>
        <div className="board__bar">
          <button className="home-button" onClick={this.onHomeClick}><i className="material-icons">arrow_back</i></button>
          <Output value={this.state.outputValue} onOutputClick={this.onOutputClick} />
        </div>
        <div className="board__buttons" ref={(ref) => { this.gridContainer = ref; }}>
          <ResponsiveReactGridLayout className="grid" layouts={layouts}
            breakpoints={this.state.breakpoints}
            cols={this.state.cols}
            verticalCompact={true}
            rowHeight={this.state.rowHeight}
            isDraggable={this.props.edit}
            isResizable={this.props.edit}
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
  edit: React.PropTypes.bool,
  onOutputClick: React.PropTypes.func,
  onOutputChange: React.PropTypes.func
};

Board.defaultProps = {
  homeBoard: 'home'
};

export default injectIntl(Board);
