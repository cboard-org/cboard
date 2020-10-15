import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import './EditGridButtons.css';

const renderButtons = (rows, columns, isVertical) => {
  return (
    <ButtonGroup
      orientation={isVertical ? 'vertical' : 'horizontal'}
      color="primary"
      aria-label="edit_grid_button_group"
      variant="contained"
    >
      <Button aria-label="edit_grid_button">+</Button>
      <Button aria-label="edit_grid_value">
        {isVertical ? rows.toString() : columns.toString()}
      </Button>
      <Button aria-label="edit_grid_button">-</Button>
    </ButtonGroup>
  );
};

const EditGridButtons = ({ rows, columns, active }) => {
  if (!active) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="EditGridButtons left">
        {renderButtons(rows, columns, true)}
      </div>
      <div className="EditGridButtons right">
        {renderButtons(rows, columns, true)}
      </div>
      <div className="EditGridButtons top">
        {renderButtons(rows, columns, false)}
      </div>
      <div className="EditGridButtons bottom">
        {renderButtons(rows, columns, false)}
      </div>
    </React.Fragment>
  );
};

EditGridButtons.props = {
  active: PropTypes.bool.isRequired,
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired
};

export default EditGridButtons;
