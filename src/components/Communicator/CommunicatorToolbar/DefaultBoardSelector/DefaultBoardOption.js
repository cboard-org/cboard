import React from 'react';
import { CardContent } from '@material-ui/core';

import { Card, CardMedia, Typography } from '@mui/material';

const DefaultBoardOption = ({ rootBoard, onClick }) => {
  return (
    <Card
      sx={{
        width: { xs: '100%', md: '50%' }
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={rootBoard.caption}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {rootBoard.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {rootBoard.author /*SHOULD BE DESCRIPTION*/}
        </Typography>
      </CardContent>
    </Card>
  );
};

DefaultBoardOption.props = { rootBoard: null, onclick: () => {} };
export default DefaultBoardOption;
