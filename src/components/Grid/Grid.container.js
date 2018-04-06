import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import sizeMe from 'react-sizeme';
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { changeLayouts } from './Grid.actions';
import './Grid.css';

const layoutShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number
  })
);

const colsRowsShape = PropTypes.shape({
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number,
  xs: PropTypes.number,
  xxs: PropTypes.number
});

export class GridContainer extends PureComponent {
  static propTypes = {
    cols: colsRowsShape,
    rows: colsRowsShape,
    breakpoints: colsRowsShape,
    layouts: PropTypes.shape({
      lg: layoutShape,
      md: layoutShape,
      sm: layoutShape,
      xs: layoutShape,
      xxs: layoutShape
    }),
    gap: PropTypes.number,
    children: PropTypes.node,
    edit: PropTypes.bool
  };

  static defaultProps = {
    cols: { lg: 6, md: 6, sm: 5, xs: 4, xxs: 3 },
    rows: { lg: 3, md: 3, sm: 3, xs: 3, xxs: 3 },
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 567, xxs: 0 },
    gap: 10,
    edit: false
  };

  state = {
    dragging: false
  };

  grid = null;

  calcRowHeight(height) {
    // todo: rewrite this with variable caching
    const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];
    let rowHeight;

    for (let i = 0; i < breakpoints.length; i += 1) {
      const breakpoint = breakpoints[i];

      if (
        window.matchMedia(
          `(min-width: ${this.props.breakpoints[breakpoint]}px)`
        ).matches
      ) {
        const rows = this.props.rows[breakpoint];
        const padding = this.props.gap * (rows - 1);
        const margin = this.props.gap * 2;
        const spaceBetween = margin + padding;
        const gridHeight = this.props.size.height;
        rowHeight = (gridHeight - spaceBetween) / rows;
        break;
      }
    }
    return rowHeight < 80 ? 80 : rowHeight;
  }

  generateLayout(cols) {
    const layout = React.Children.map(this.props.children, (child, index) => {
      return {
        x: index % cols,
        y: Math.floor(index / cols),
        w: 1,
        h: 1,
        i: child.key
      };
    });
    return layout;
  }

  generateLayouts() {
    const { breakpoints, cols } = this.props;
    const layouts = {};

    Object.keys(breakpoints).forEach(bp => {
      layouts[bp] = this.generateLayout(cols[bp]);
    });
    return layouts;
  }

  handleLayoutChange = (currentLayout, layouts) => {
    const { onLayoutChange, id } = this.props;
    onLayoutChange({ id, layouts });
  };

  handleDragStart = (layout, oldItem, newItem, placeholder, event, element) => {
    this.setState({ dragging: true });
  };

  handleDragStop = (layout, oldItem, newItem, placeholder, event, element) => {
    this.setState({ dragging: false });
  };

  render() {
    const {
      id,
      size,
      cols,
      gap,
      edit,
      breakpoints,
      layouts,
      children
    } = this.props;

    return (
      <div className={classNames('Grid', { dragging: this.state.dragging })}>
        <ResponsiveReactGridLayout
          breakpoints={breakpoints}
          cols={cols}
          layouts={layouts[id] || this.generateLayouts()}
          width={size.width}
          rowHeight={this.calcRowHeight(size.height)}
          containerPadding={[gap, gap]}
          margin={[gap, gap]}
          isDraggable={edit}
          isResizable={edit}
          onLayoutChange={this.handleLayoutChange}
          onDragStart={this.handleDragStart}
          onDragStop={this.handleDragStop}
        >
          {children}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  layouts: state.grid.layouts
});

export const mapDispatchToProps = {
  onLayoutChange: changeLayouts
};

export default connect(mapStateToProps, mapDispatchToProps)(
  sizeMe({ monitorHeight: true })(GridContainer)
);
