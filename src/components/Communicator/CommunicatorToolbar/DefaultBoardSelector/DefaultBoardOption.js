import React from 'react';
import { CardContent } from '@material-ui/core';

import { Card, CardMedia, Typography } from '@mui/material';

import messages from '../CommunicatorToolbar.messages';

const DefaultBoardOption = ({ rootBoard, onClick, intl }) => {
  return (
    <Card
      sx={{
        width: { xs: '100%' }
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        alt={intl.formatMessage(messages.defaultBoardImageAlt)}
        height="140"
        image={rootBoard.caption}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {rootBoard.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {rootBoard.description /*SHOULD BE translated*/}
        </Typography>
      </CardContent>
    </Card>
  );
};

DefaultBoardOption.props = { rootBoard: null, onclick: () => {} };
export default DefaultBoardOption;
