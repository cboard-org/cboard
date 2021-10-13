import React, { useState } from 'react';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

import './GooglePhotosFilter.css';
import { Button } from '@material-ui/core';

import { injectIntl } from 'react-intl';
import messages from './GooglePhotosFilter.messages';

export default injectIntl(function GooglePhotosFilter(props) {
  const { intl } = props;
  const [chipData, setChipData] = useState([
    { key: 'LANDSCAPES', label: 'landscapes', value: false },
    { key: 'RECEIPTS', label: 'receipts', value: false },
    { key: 'CITYSCAPES', label: 'cityscapes', value: false },
    { key: 'LANDMARKS', label: 'landmarks', value: false },
    { key: 'SELFIES', label: 'selfies', value: false },
    { key: 'PEOPLE', label: 'people', value: false },
    { key: 'PETS', label: 'pets', value: false },
    { key: 'WEDDINGS', label: 'weddings', value: false },
    { key: 'BIRTHDAYS', label: 'birthdays', value: false },
    { key: 'DOCUMENTS', label: 'documents', value: false },
    { key: 'TRAVEL', label: 'travel', value: false },
    { key: 'ANIMALS', label: 'animals', value: false },
    { key: 'FOOD', label: 'food', value: false },
    { key: 'SPORT', label: 'sport', value: false },
    { key: 'NIGHT', label: 'night', value: false },
    { key: 'PERFORMANCES', label: 'performances', value: false },
    { key: 'WHITEBOARDS', label: 'whiteboards', value: false },
    { key: 'SCREENSHOTS', label: 'screenshots', value: false },
    { key: 'UTILITY', label: 'utility', value: false },
    { key: 'ARTS', label: 'arts', value: false },
    { key: 'CRAFTS', label: 'crafts', value: false },
    { key: 'FASHION', label: 'fashion', value: false },
    { key: 'HOUSES', label: 'houses', value: false },
    { key: 'GARDENS', label: 'gardens', value: false },
    { key: 'FLOWERS', label: 'flowers', value: false },
    { key: 'HOLIDAYS', label: 'holidays', value: false }
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
        <p className="filter_subtitle">
          {intl.formatMessage(messages.instructions)}
        </p>
      </div>
      <div component="ul" className="filter_list">
        {chipData.map(data => {
          return (
            <li key={data.key}>
              <Chip
                label={data.label} //TO DO translate data label
                onClick={handleclick(data)}
                className={'chip'}
                color={data.value ? 'primary' : 'default'}
              />
            </li>
          );
        })}
      </div>
      <div className="filter_content">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSearchClick}
          className="search_button"
        >
          {intl.formatMessage(messages.search)}
        </Button>
      </div>
    </Paper>
  );
});
