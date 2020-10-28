import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import './EditGridButtons.css';

class EditGridButtons extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    onAddColumn: PropTypes.func.isRequired,
    onAddRow: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  onAddColumn(isLeftOrTop) {
    const { onAddColumn } = this.props;
    onAddColumn(isLeftOrTop);
  }

  onAddRow(isLeftOrTop) {
    const { onAddRow } = this.props;
    onAddRow(isLeftOrTop);
  }

  renderButtons = (isVertical, isLeftOrTop) => {
    const { rows, columns } = this.props;
    return (
      <ButtonGroup
        orientation={isVertical ? 'vertical' : 'horizontal'}
        color="primary"
        aria-label="edit_grid_button_group"
        variant="contained"
      >
        <Button
          onClick={
            isVertical
              ? this.onAddColumn.bind(this, isLeftOrTop)
              : this.onAddRow.bind(this, isLeftOrTop)
          }
          aria-label="edit_grid_button"
        >
          +
        </Button>
        <Button aria-label="edit_grid_value">
          {isVertical ? rows.toString() : columns.toString()}
        </Button>
        <Button
          onClick={
            isVertical
              ? this.onAddColumn.bind(this, isLeftOrTop)
              : this.onAddRow.bind(this, isLeftOrTop)
          }
          aria-label="edit_grid_button"
        >
          -
        </Button>
      </ButtonGroup>
    );
  };

  render() {
    const { rows, columns, active } = this.props;
    if (!active) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="EditGridButtons left">
          {this.renderButtons(true, true)}
        </div>
        <div className="EditGridButtons right">
          {this.renderButtons(true, false)}
        </div>
        <div className="EditGridButtons top">
          {this.renderButtons(false, true)}
        </div>
        <div className="EditGridButtons bottom">
          {this.renderButtons(false, false)}
        </div>
      </React.Fragment>
    );
  }
}

export default EditGridButtons;
