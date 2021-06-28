import React, { useState } from 'react';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

import './GooglePhotosFilter.css';
import { Button } from '@material-ui/core';

export default function GooglePhotosFilter(props) {
  const [chipData, setChipData] = useState([
    { key: 'LANDSCAPES', label: 'landscapes', value: false },
    { key: 'RECEIPTS', label: 'receipts', value: false },
    { key: 'CITYSCAPES', label: 'cityscapes', value: false },
    { key: 'LANDMARKS', label: 'landmarks', value: false },
    { key: 'SELFIES', label: 'selfies', value: false },
    { key: 'PEOPLE', label: 'people', value: false }
  ]);

  const handleclick = chipToToogle => () => {
    setChipData(chips =>
      chips.map(chip => {
        if (chip.key === chipToToogle.key) {
          chip.value = !chip.value;
        }
        return chip;
      })
    );
  };

  const handleSearchClick = () => {
    const filters = [];
    const activeFilters = chipData.filter(chip => chip.value);
    activeFilters.forEach(element => {
      filters.push(element.key);
    });
    props.filterSearch(filters);
  };

  return (
    <Paper className="filter_Paper">
      <div className="filter_content">
        <p>instructions</p>
      </div>
      <div component="ul" className="filter_list">
        {chipData.map(data => {
          return (
            <li key={data.key}>
              <Chip
                label={data.label}
                onClick={handleclick(data)}
                className={'chip'}
                color={data.value ? 'primary' : 'default'}
              />
            </li>
          );
        })}
      </div>
      <div className="filter_content">
        <Button color={'default'} onClick={handleSearchClick}>
          SEARCH
        </Button>
      </div>
    </Paper>
  );
}
