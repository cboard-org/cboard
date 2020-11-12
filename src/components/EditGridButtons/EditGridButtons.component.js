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
    onAddRemoveColumn: PropTypes.func.isRequired,
    onAddRemoveRow: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  onAddRemoveColumn(isAdd, isLeftOrTop) {
    const { onAddRemoveColumn } = this.props;
    onAddRemoveColumn(isAdd, isLeftOrTop);
  }

  onAddRemoveRow(isAdd, isLeftOrTop) {
    const { onAddRemoveRow } = this.props;
    onAddRemoveRow(isAdd, isLeftOrTop);
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
              ? this.onAddRemoveRow.bind(this, true, isLeftOrTop)
              : this.onAddRemoveColumn.bind(this, true, isLeftOrTop)
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
              ? this.onAddRemoveRow.bind(this, false, isLeftOrTop)
              : this.onAddRemoveColumn.bind(this, false, isLeftOrTop)
          }
          aria-label="edit_grid_button"
        >
          -
        </Button>
      </ButtonGroup>
    );
  };

  render() {
    const { active } = this.props;
    if (!active) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="EditGridButtons left">
          {this.renderButtons(false, true)}
        </div>
        <div className="EditGridButtons right">
          {this.renderButtons(false, false)}
        </div>
        <div className="EditGridButtons top">
          {this.renderButtons(true, true)}
        </div>
        <div className="EditGridButtons bottom">
          {this.renderButtons(true, false)}
        </div>
      </React.Fragment>
    );
  }
}

export default EditGridButtons;
