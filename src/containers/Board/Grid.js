import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

import { throttle, clone } from 'lodash';

import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');

class Grid extends PureComponent {
  constructor(props) {
    super(props);
    this.handleResize = throttle(this.handleResize, 300);

    this.state = {
      layouts: null,
      rowHeight: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setRowHeight();
  }

  generateLayout(cols) {
    return React.Children.map(this.props.children, (button, index) => {
      return { x: index % cols, y: Math.floor(index / cols), w: 1, h: 1, i: this.props.id + '.' + index };
    });
  }

  generateLayouts(breakpoints) {
    const layouts = {};

    for (let breakpoint in breakpoints) {
      layouts[breakpoint] = this.generateLayout(this.props.cols[breakpoint]);
    }
    return layouts;
  }

  setRowHeight() {
    const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];
    let rowHeight;

    for (let breakpoint of breakpoints) {
      if (window.matchMedia('(min-width: ' + this.props.breakpoints[breakpoint] + 'px)').matches) {
        const cols = this.props.cols[breakpoint];
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

  handleResize = (event) => {
    this.setRowHeight();
  }

  onLayoutChange = (layout, layouts) => {
    saveToLS(this.props.id, layouts);
    this.setState({ layouts });
    // this.props.onLayoutChange(layout, layouts);
  }

  getLayouts() {
    // window.localStorage.clear();
    const layoutsLocalStorage = this.getLayoutsLocalStorage();
    const layouts = Object.keys(layoutsLocalStorage).length ?
      layoutsLocalStorage :
      this.generateLayouts(this.props.breakpoints);

    return layouts;
  }

  getLayoutsLocalStorage() {
    const layouts = getFromLS(this.props.id) || {};
    return layouts;
  }

  render() {
    const layouts = this.getLayouts();

    return (
      <ResponsiveReactGridLayout
        className="grid"
        layouts={layouts}
        onLayoutChange={this.onLayoutChange}
        rowHeight={this.state.rowHeight}
        cols={this.props.cols}
        breakpoints={this.props.breakpoints}
        isDraggable={this.props.edit}
        isResizable={this.props.edit}
        measureBeforeMount={true}
        verticalCompact={true}
        ref={ref => { this.rrgl = ref }}
      >
        {this.props.children}
      </ResponsiveReactGridLayout>
    );
  }
}

Grid.propTypes = {
  id: PropTypes.string,
  cols: PropTypes.object,
  breakpoints: PropTypes.object,
  edit: PropTypes.bool
}

Grid.defaultProps = {
  id: 'default',
  cols: { lg: 10, md: 8, sm: 6, xs: 6, xxs: 3 },
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 567, xxs: 0 },
  edit: false
}

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

export default injectIntl(Grid);