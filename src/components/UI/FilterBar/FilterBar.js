import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

import './FilterBar.css';

function FilterBar(props) {
  const { onChange, options, selectedOptionId } = props;

  return (
    <div className="FilterBar">
      {options.map(opt => {
        const isSelected = opt.id === selectedOptionId;
        const buttonClassName = classNames('FilterBar__button', {
          'is-selected': isSelected
        });

        return (
          <Button
            className={buttonClassName}
            onClick={() => {
              onChange(opt);
            }}
            key={opt.id}
          >
            {opt.text}
          </Button>
        );
      })}
    </div>
  );
}

FilterBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string }))
    .isRequired,
  selectedOptionId: PropTypes.string.isRequired
};

FilterBar.defaultProps = {
  buttons: []
};

export default FilterBar;
