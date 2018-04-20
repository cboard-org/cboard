import React from 'react';
import { FormattedMessage } from 'react-intl';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { withStyles } from 'material-ui/styles';

import messages from './EmptyBoard.messages';
import './EmptyBoard.css';

const styles = theme => ({
  icon: {
    width: 120,
    height: 120,
    color: '#aaa'
  },
  text: {
    color: '#aaa'
  }
});

function EmptyBoard({ classes }) {
  return (
    <div className="EmptyBoard">
      <ViewModuleIcon className={classes.icon} />
      <div className={classes.text}>
        <FormattedMessage {...messages.boardIsEmpty} />
      </div>
    </div>
  );
}

export default withStyles(styles)(EmptyBoard);
