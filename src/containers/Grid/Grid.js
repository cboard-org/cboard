import React, { PureComponent } from 'react';
import sizeMe from 'react-sizeme';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import { changeLayouts } from './actions';
import './Grid.css';

export class Grid extends PureComponent {
  state = {
    dragging: false
  };

  grid = null;

  calcRowHeight(height) {
    // todo: rewrite this with var caching
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
    return rowHeight;
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

  handleResize = () => {};

  handleLayoutChange = (currentLayout, layouts) => {
    const { onLayoutChange, id } = this.props;
    onLayoutChange({ id, layouts });
  };

  handleDragStart = (layout, oldItem, newItem, placeholder, event, element) => {
  };

  handleDrag = (layout, oldItem, newItem, placeholder, event, element) => {
  };

  handleDragEnd = (layout, oldItem, newItem, placeholder, event, element) => {
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
      <div className={classNames({ dragging: this.state.dragging }, 'Grid')}>
        <ResponsiveReactGridLayout
          width={size.width}
          rowHeight={this.calcRowHeight(size.height)}
          layouts={layouts[id] || this.generateLayouts()}
          onLayoutChange={this.handleLayoutChange}
          cols={cols}
          breakpoints={breakpoints}
          containerPadding={[gap, gap]}
          margin={[gap, gap]}
          isDraggable={edit}
          isResizable={edit}
          measureBeforeMount
          onDragStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onDragEnd={this.handleDragEnd}
        >
          {children}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

const layoutShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number
  })
);

Grid.propTypes = {
  cols: PropTypes.shape({
    lg: PropTypes.number,
    md: PropTypes.number,
    sm: PropTypes.number,
    xs: PropTypes.number,
    xxs: PropTypes.number
  }),
  rows: PropTypes.shape({
    lg: PropTypes.number,
    md: PropTypes.number,
    sm: PropTypes.number,
    xs: PropTypes.number,
    xxs: PropTypes.number
  }),
  breakpoints: PropTypes.shape({
    lg: PropTypes.number,
    md: PropTypes.number,
    sm: PropTypes.number,
    xs: PropTypes.number,
    xxs: PropTypes.number
  }),
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

Grid.defaultProps = {
  cols: { lg: 6, md: 6, sm: 5, xs: 4, xxs: 3 },
  rows: { lg: 3, md: 3, sm: 3, xs: 3, xxs: 3 },
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 567, xxs: 0 },
  gap: 10,
  edit: false
};

const mapStateToProps = state => {
  return {
    layouts: state.grid.layouts
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    onLayoutChange: action => {
      dispatch(changeLayouts(action));
    },
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  sizeMe({ monitorHeight: true })(Grid)
);
