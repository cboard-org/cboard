import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { injectIntl, intlShape } from 'react-intl';
import messages from './EditGridButtons.messages.js';
import './EditGridButtons.css';

function EditGridButtons({
  isVertical,
  active,
  columns,
  rows,
  onAddRemoveRow,
  onAddRemoveColumn,
  intl
}) {
  const orientation = isVertical
    ? intl.formatMessage(messages.columns)
    : intl.formatMessage(messages.rows);
  const isLeftOrTop = false;
  if (!active) {
    return null;
  }
  return (
    <React.Fragment>
      <span>{orientation}:</span>
      <Button
        className="EditGridButtons__roundButton"
        onClick={
          isVertical
            ? () => {
                onAddRemoveColumn(false, isLeftOrTop);
              }
            : () => {
                onAddRemoveRow(false, isLeftOrTop);
              }
        }
        aria-label="edit_grid_button"
      >
        <RemoveIcon />
      </Button>
      <div className="EditGridButtons__box" aria-label="edit_grid_value">
        <span>{isVertical ? columns.toString() : rows.toString()}</span>
      </div>
      <Button
        className="EditGridButtons__roundButton"
        onClick={
          isVertical
            ? () => {
                onAddRemoveColumn(true, isLeftOrTop);
              }
            : () => {
                onAddRemoveRow(true, isLeftOrTop);
              }
        }
        aria-label="edit_grid_button"
      >
        <AddIcon />
      </Button>
    </React.Fragment>
  );
}
EditGridButtons.propTypes = {
  isVertical: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  onAddRemoveRow: PropTypes.func.isRequired,
  onAddRemoveColumn: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(EditGridButtons);
