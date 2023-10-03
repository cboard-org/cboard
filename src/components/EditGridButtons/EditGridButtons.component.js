import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import './EditGridButtons.css';

class EditGridButtons extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    onAddRemoveColumn: PropTypes.func.isRequired,
    onAddRemoveRow: PropTypes.func.isRequired,
    moveColsButtonToLeft: PropTypes.bool
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
        fullWidth={true}
        size="large"
        variant="contained"
      >
        <Button
          onClick={
            isVertical
              ? this.onAddRemoveColumn.bind(this, true, isLeftOrTop)
              : this.onAddRemoveRow.bind(this, true, isLeftOrTop)
          }
          aria-label="edit_grid_button"
        >
          {isVertical ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
        </Button>
        <Button aria-label="edit_grid_value">
          {isVertical ? columns.toString() : rows.toString()}
        </Button>
        <Button
          onClick={
            isVertical
              ? this.onAddRemoveColumn.bind(this, false, isLeftOrTop)
              : this.onAddRemoveRow.bind(this, false, isLeftOrTop)
          }
          aria-label="edit_grid_button"
        >
          {isVertical ? <KeyboardArrowLeftIcon /> : <KeyboardArrowUpIcon />}
        </Button>
      </ButtonGroup>
    );
  };

  render() {
    const { active, moveColsButtonToLeft } = this.props;
    if (!active) {
      return null;
    }

    return (
      <React.Fragment>
        <div
          className={`EditGridButtons ${
            moveColsButtonToLeft ? 'left' : 'right'
          }`}
        >
          {this.renderButtons(true, false)}
        </div>
        <div className="EditGridButtons bottom">
          {this.renderButtons(false, false)}
        </div>
      </React.Fragment>
    );
  }
}

export default EditGridButtons;
