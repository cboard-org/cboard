import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { throttle } from 'lodash';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');

// TODO: need a localStorage service
function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(`board.${key}`)) || {};
    } catch (e) { /* Ignore */ }
  }
  return ls.layouts;
}

// TODO: need a localStorage service
function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(`board.${key}`, JSON.stringify({
      layouts: value,
    }));
  }
}

class Grid extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      layouts: null,
      rowHeight: 0,
    };

    this.handleResize = throttle(this.handleResize.bind(this), 300);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setRowHeight();
  }

  setRowHeight() {
    const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];
    let rowHeight;


    for (let i = 0; i < breakpoints.length; i += 1) {
      const breakpoint = breakpoints[i];

      if (window.matchMedia(`(min-width: ${this.props.breakpoints[breakpoint]}px)`).matches) {
        const cols = this.props.cols[breakpoint];
        const padding = 10 * (cols - 1);
        const margin = 10 * 2;
        const spaceBetween = margin + padding;
        // TODO: cache DOM ref
        const gridWidth = ReactDOM.findDOMNode(this.rrgl).offsetWidth;
        rowHeight = (gridWidth - spaceBetween) / cols;
        break;
      }
    }
    this.setState({ rowHeight });
  }

  getLayouts() {
    window.localStorage.clear();
    const layoutsLocalStorage = this.getLayoutsLocalStorage();
    const layouts = Object.keys(layoutsLocalStorage).length ?
      layoutsLocalStorage :
      this.generateLayouts(this.props.breakpoints);

    return layouts;
  }

  getLayoutsLocalStorage() {
    // TODO: need a localStorage service
    const layouts = getFromLS(this.props.id) || {};
    return layouts;
  }

  handleResize() {
    this.setRowHeight();
  }

  handleLayoutChange(layout, layouts) {
    // TODO: need a localStorage service
    saveToLS(this.props.id, layouts);
    this.setState({ layouts });
    // this.props.onLayoutChange(layout, layouts);
  }

  generateLayout(cols) {
    return React.Children.map(this.props.children, (button, index) => ({
      x: index % cols,
      y: Math.floor(index / cols),
      w: 1,
      h: 1,
      i: `${this.props.id}.${index}`,
    }));
  }

  generateLayouts(breakpoints) {
    const breakpointKeys = Object.keys(breakpoints);
    const layouts = {};

    breakpointKeys.forEach((breakpoint) => {
      layouts[breakpoint] = this.generateLayout(this.props.cols[breakpoint]);
    });
    return layouts;
  }

  render() {
    const layouts = this.getLayouts();

    return (
      <ResponsiveReactGridLayout
        className="grid"
        layouts={layouts}
        onLayoutChange={this.handleLayoutChange}
        rowHeight={this.state.rowHeight}
        cols={this.props.cols}
        breakpoints={this.props.breakpoints}
        isDraggable={this.props.edit}
        isResizable={this.props.edit}
        measureBeforeMount
        verticalCompact
        ref={(ref) => { this.rrgl = ref; }}
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
  children: PropTypes.node,
  edit: PropTypes.bool,
};

Grid.defaultProps = {
  id: 'default',
  cols: { lg: 10, md: 8, sm: 6, xs: 6, xxs: 3 },
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 567, xxs: 0 },
  children: null,
  edit: false,
};

export default injectIntl(Grid);
