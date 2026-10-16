import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import './FilterBar.css';

function FilterBar(props) {
  const { onChange, options, onResize } = props;
  const barRef = useRef(null);

  useLayoutEffect(() => {
    if (!onResize) return;
    const measure = () =>
      onResize(barRef.current.getBoundingClientRect().bottom);
    measure();
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measure)
        : null;
    observer?.observe(barRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [onResize]);

  return (
    <div className="FilterBar" ref={barRef}>
      <FormGroup className="FilterBar__FormGroup" row>
        {options.map((opt) => {
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
  onResize: PropTypes.func,
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
