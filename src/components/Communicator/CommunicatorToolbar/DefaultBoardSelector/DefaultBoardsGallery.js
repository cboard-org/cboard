import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';

import { DEFAULT_BOARDS } from '../../../../helpers';
import DefaultBoardOption from './DefaultBoardOption';
import { Grid } from '@material-ui/core';

const defaultBoardsEntries = Object.entries(DEFAULT_BOARDS);

const DefaultBoardsGallery = ({ onOptionClick, intl }) => {
  return (
    <DialogContent>
      <Grid container spacing={2} alignItems="stretch">
        {defaultBoardsEntries.map((board, defaultBoardIndex) => {
          //   Always first board is root board?
          const boards = board[1];
          if (boards?.length <= 1) return null;
          const rootBoard = boards[0];
          const ENTRIE_NAME_POSITION = 0;
          const defaultBoardName =
            defaultBoardsEntries[defaultBoardIndex][ENTRIE_NAME_POSITION];
          return (
            <Grid item xs={12} sm={6} key={defaultBoardIndex}>
              <DefaultBoardOption
                onClick={() => onOptionClick(defaultBoardName)}
                rootBoard={rootBoard}
                intl={intl}
              />
            </Grid>
          );
        })}
      </Grid>
    </DialogContent>
  );
};

DefaultBoardsGallery.propTypes = {
  onOptionClick: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default DefaultBoardsGallery;
