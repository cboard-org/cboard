import React from 'react';
import PropTypes from 'prop-types';
import GridSizePanel from '../GridSizePanel/index';

function FooterEditToolbar({
  isSelecting,
  isFixedBoard,
  active,
  columns,
  rows,
  onAddRemoveRow,
  onAddRemoveColumn
}) {
  if (!active) {
    return null;
  }
  return (
    <div>
      <GridSizePanel
        aria-label="grid-size-panel"
        isSelecting={isSelecting}
        isFixedBoard={isFixedBoard}
        active={active}
        columns={columns}
        rows={rows}
        onAddRemoveRow={onAddRemoveRow}
        onAddRemoveColumn={onAddRemoveColumn}
      />
    </div>
  );
}
FooterEditToolbar.propTypes = {
  isSelecting: PropTypes.bool.isRequired,
  isFixedBoard: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  onAddRemoveRow: PropTypes.func.isRequired,
  onAddRemoveColumn: PropTypes.func.isRequired
};

export default FooterEditToolbar;
