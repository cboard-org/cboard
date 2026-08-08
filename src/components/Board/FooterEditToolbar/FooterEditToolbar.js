import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import GridSizeSelector from '../GridSizeSelector/index';
import messages from './FooterEditToolbar.messages.js';
import './FooterEditToolbar.css';

function FooterEditToolbar({
  isSelecting,
  isFixedBoard,
  active,
  columns,
  rows,
  onAddRemoveRow,
  onAddRemoveColumn,
  intl
}) {
  const isFixed = !!isFixedBoard;

  return (
    <>
      {isSelecting && isFixed && (
        <div className="FooterEditToolbar" aria-label="grid-size-selector">
          <GridSizeSelector
            active={active}
            dimension={rows}
            onAddRemoveClick={onAddRemoveRow}
            labelMessage={intl.formatMessage(messages.rows)}
          />
          <GridSizeSelector
            active={active}
            dimension={columns}
            onAddRemoveClick={onAddRemoveColumn}
            labelMessage={intl.formatMessage(messages.columns)}
          />
        </div>
      )}
    </>
  );
}
FooterEditToolbar.propTypes = {
  isSelecting: PropTypes.bool.isRequired,
  isFixedBoard: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  onAddRemoveRow: PropTypes.func.isRequired,
  onAddRemoveColumn: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(FooterEditToolbar);
