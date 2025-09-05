import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import './GridSizeSelector.css';

function GridSizeSelector({
  active,
  dimension,
  onAddRemoveClick,
  labelMessage
}) {
  const isLeftOrTop = false;

  return (
    <div
      className="GridSizeSelector__ButtonGroup"
      aria-label="gridSize_selector_button_group"
    >
      <span>{labelMessage}:</span>
      <Button
        className="GridSizeSelector__roundButton"
        disabled={!active}
        onClick={() => {
          onAddRemoveClick(false, isLeftOrTop);
        }}
        aria-label="gridSize_selector_button"
      >
        <RemoveIcon />
      </Button>
      <div
        className="GridSizeSelector__counter"
        aria-label="gridSize_selector_value"
      >
        <span>{dimension.toString()}</span>
      </div>
      <Button
        className="GridSizeSelector__roundButton"
        disabled={!active}
        onClick={() => {
          onAddRemoveClick(true, isLeftOrTop);
        }}
        aria-label="gridSize_selector_button"
      >
        <AddIcon />
      </Button>
    </div>
  );
}
GridSizeSelector.propTypes = {
  active: PropTypes.bool.isRequired,
  dimension: PropTypes.number.isRequired,
  onAddRemoveClick: PropTypes.func.isRequired,
  labelMessage: PropTypes.string.isRequired
};

export default GridSizeSelector;
