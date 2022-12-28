import React, { useState } from 'react';
import { CardContent } from '@material-ui/core';
import { Card, CardMedia, Typography } from '@material-ui/core';

import { isCordova } from '../../../../cordova-util';
import styles from './DefaultBoardSelector.module.css';

import messages from '../CommunicatorToolbar.messages';

const DefaultBoardOption = ({ rootBoard, onClick, intl }) => {
  const [shadow, setShadow] = useState(false);

  const onMouseOver = () => setShadow(true);
  const onMouseOut = () => setShadow(false);

  // Cordova path cannot be absolute
  const image =
    isCordova() && rootBoard.caption && rootBoard.caption.search('/') === 0
      ? `.${rootBoard.caption}`
      : rootBoard.caption;

  return (
    <Card
      className={styles.card}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      raised={shadow}
    >
      <CardMedia
        component="img"
        alt={intl.formatMessage(messages.defaultBoardImageAlt)}
        height="140"
        image={image}
      />
      <CardContent className={styles.cardContent}>
        <Typography gutterBottom variant="h6">
          {rootBoard.name}
        </Typography>
        <Typography variant="body2">
          {intl.formatMessage(messages[rootBoard.description])}
        </Typography>
      </CardContent>
    </Card>
  );
};

DefaultBoardOption.props = { rootBoard: null, onclick: () => {} };
export default DefaultBoardOption;
