import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import { Stack } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';

import { DEFAULT_BOARDS } from '../../../../helpers';
import DefaultBoardOption from './DefaultBoardOption';

const defaultBoardsEntries = Object.entries(DEFAULT_BOARDS);

const DefaultBoardsGallery = ({ onOptionClick, intl }) => {
  return (
    <DialogContent>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ display: 'flex' }}
        alignItems="strech"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        mt={2}
      >
        {defaultBoardsEntries.map((board, defaultBoardIndex) => {
          //   Always first board is root board?
          const boards = board[1];
          if (boards?.length <= 1) return null;
          const rootBoard = boards[0];
          const ENTRIE_NAME_POSITION = 0;
          const defaultBoardName =
            defaultBoardsEntries[defaultBoardIndex][ENTRIE_NAME_POSITION];
          return (
            <DefaultBoardOption
              onClick={() => onOptionClick(defaultBoardName)}
              rootBoard={rootBoard}
              key={defaultBoardIndex}
              intl={intl}
            />
          );
        })}
      </Stack>
    </DialogContent>
  );
};

DefaultBoardsGallery.propTypes = {
  onOptionClick: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

export default DefaultBoardsGallery;
