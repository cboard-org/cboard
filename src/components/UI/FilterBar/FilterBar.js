import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

import './FilterBar.css';

function FilterBar(props) {
  const { onChange, options, selectedId } = props;

  return (
    <div className="FilterBar">
      {options.map(opt => {
        const isSelected = opt.id === selectedId;

        const buttonClassName = classNames('FilterBar__button', {
          'is-selected': isSelected
        });

        return (
          <Button
            className={buttonClassName}
            onClick={() => {
              onChange(opt);
            }}
          >
            {opt.text}
          </Button>
        );
      })}
    </div>
  );
}

FilterBar.propTypes = {};
FilterBar.defaultProps = {
  buttons: []
};

export default FilterBar;
