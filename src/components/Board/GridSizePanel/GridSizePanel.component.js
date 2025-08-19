import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { injectIntl, intlShape } from 'react-intl';
import messages from './GridSizePanel.messages.js';
import './GridSizePanel.css';

function GridSizePanel({
  isSelecting,
  isFixedBoard,
  active,
  columns,
  rows,
  onAddRemoveRow,
  onAddRemoveColumn,
  intl
}) {
  const isLeftOrTop = false;
  const isFixed = !!isFixedBoard;

  const renderButtons = isVertical => {
    const orientation = isVertical
      ? intl.formatMessage(messages.columns)
      : intl.formatMessage(messages.rows);
    return (
      <div
        className="GridSizePanel__ButtonGroup"
        aria-label="gridSize_panel_button_group"
      >
        <span>{orientation}:</span>
        <Button
          className="GridSizePanel__roundButton"
          onClick={
            isVertical
              ? () => {
                  onAddRemoveColumn(false, isLeftOrTop);
                }
              : () => {
                  onAddRemoveRow(false, isLeftOrTop);
                }
          }
          aria-label="gridSize_panel_button"
        >
          <RemoveIcon />
        </Button>
        <div
          className="GridSizePanel__counter"
          aria-label="gridSize_panel_value"
        >
          <span>{isVertical ? columns.toString() : rows.toString()}</span>
        </div>
        <Button
          className="GridSizePanel__roundButton"
          onClick={
            isVertical
              ? () => {
                  onAddRemoveColumn(true, isLeftOrTop);
                }
              : () => {
                  onAddRemoveRow(true, isLeftOrTop);
                }
          }
          aria-label="gridSize_panel_button"
        >
          <AddIcon />
        </Button>
      </div>
    );
  };
  if (!active) {
    return null;
  }
  return (
    <>
      {isSelecting && isFixed && (
        <div className="GridSizePanel" aria-label="grid_size_panel">
          {renderButtons(false)}
          {renderButtons(true)}
        </div>
      )}
    </>
  );
}
GridSizePanel.propTypes = {
  isSelecting: PropTypes.bool.isRequired,
  isFixedBoard: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  onAddRemoveRow: PropTypes.func.isRequired,
  onAddRemoveColumn: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(GridSizePanel);
