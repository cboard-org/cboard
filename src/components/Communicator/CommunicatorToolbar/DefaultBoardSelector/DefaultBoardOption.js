import React from 'react';
import { CardContent } from '@material-ui/core';

import { Card, CardMedia, Typography } from '@material-ui/core';

import styles from './DefaultBoardSelector.module.css';

import messages from '../CommunicatorToolbar.messages';

const DefaultBoardOption = ({ rootBoard, onClick, intl }) => {
  return (
    <Card className={styles.card} onClick={onClick}>
      <CardMedia
        component="img"
        alt={intl.formatMessage(messages.defaultBoardImageAlt)}
        height="140"
        image={rootBoard.caption}
      />
      <CardContent className={styles.cardContent}>
        <Typography gutterBottom variant="h6">
          {rootBoard.name}
        </Typography>
        <Typography variant="body2">
          {rootBoard.description /*SHOULD BE translated*/}
        </Typography>
      </CardContent>
    </Card>
  );
};

DefaultBoardOption.props = { rootBoard: null, onclick: () => {} };
export default DefaultBoardOption;
