import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import './FilterBar.css';

function FilterBar(props) {
  const { onChange, options } = props;

  return (
    <div className="FilterBar">
      <FormGroup className="FilterBar__FormGroup" row>
        {options.map(opt => {
          return (
            <FormControlLabel
              control={
                <Switch
                  checked={opt.enabled}
                  onChange={() => {
                    onChange(opt);
                  }}
                  key={opt.id}
                  value={opt.id}
                  color="secondary"
                />
              }
              key={opt.id}
              label={opt.text}
              labelPlacement="bottom"
            />
          );
        })}
      </FormGroup>
    </div>
  );
}

FilterBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      enabled: PropTypes.bool
    })
  ).isRequired
};

FilterBar.defaultProps = {
  buttons: []
};

export default FilterBar;
