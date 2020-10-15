import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import './EditGridButtons.css';
const renderButtons = isVertical => {
  return (
    <ButtonGroup
      orientation={isVertical ? 'vertical' : 'horizontal'}
      color="primary"
      aria-label="vertical contained primary button group"
      variant="contained"
    >
      <Button>+</Button>
      <Button>4</Button>
      <Button>-</Button>
    </ButtonGroup>
  );
};

const EditGridButtons = ({ active }) => {
  if (!active) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="EditGridButtons left">{renderButtons(true)}</div>
      <div className="EditGridButtons right">{renderButtons(true)}</div>
      <div className="EditGridButtons top">{renderButtons(false)}</div>
      <div className="EditGridButtons bottom">{renderButtons(false)}</div>
    </React.Fragment>
  );
};

EditGridButtons.props = {
  navHistory: PropTypes.arrayOf(PropTypes.string),
  previousBoard: PropTypes.func,
  toRootBoard: PropTypes.func
};

export default EditGridButtons;
