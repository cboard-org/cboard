import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './GrammarBar.css';

const GrammarBar = ({ inflectionOptions, onOptionClick }) => {
  if (!inflectionOptions || inflectionOptions.length === 0) {
    return null;
  }

  const handleOptionClick = (event, option) => {
    event.stopPropagation();
    onOptionClick(option);
  };

  return (
    <div className="GrammarBar" data-testid="grammar-bar">
      <div className="GrammarBar__container">
        {inflectionOptions.map((option, index) => (
          <Button
            key={index}
            variant="outlined"
            className="GrammarBar__card"
            onClick={event => handleOptionClick(event, option)}
            size="small"
          >
            {option.shorthandLabel}
          </Button>
        ))}
      </div>
    </div>
  );
};

GrammarBar.propTypes = {
  inflectionOptions: PropTypes.arrayOf(
    PropTypes.shape({
      shorthandLabel: PropTypes.string.isRequired,
      outputLabel: PropTypes.string.isRequired,
      vocalization: PropTypes.string.isRequired,
      sound: PropTypes.string
    })
  ),

  onOptionClick: PropTypes.func.isRequired
};

GrammarBar.defaultProps = {
  inflectionOptions: []
};

export default GrammarBar;
