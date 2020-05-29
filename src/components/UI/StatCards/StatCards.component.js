import React from 'react';
import { Grid, Card, IconButton, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import SpellCheckIcon from '@material-ui/icons/Spellcheck';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import EditIcon from '@material-ui/icons/Edit';

import './StatCards.css';

const styles = theme => ({
  icon: {
    fontSize: '44px',
    opacity: 0.6,
    color: theme.palette.primary.main
  }
});

const StatCards = ({ classes, data }) => {
  return (
    <div className="StatCards">
      <Grid container spacing={3} className="StatCards__Container">
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={6}>
            <div className="StatCards__Card__Items">
              <SpellCheckIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                  Total words
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.words}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={6}>
            <div className="StatCards__Card__Items">
              <RecordVoiceOverIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                  Total phrases
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.phrases}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={6}>
            <div className="StatCards__Card__Items">
              <ViewModuleIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                  Boards used
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.boards}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={6}>
            <div className="StatCards__Card__Items">
              <EditIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                  Tiles edited
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.editions}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(StatCards);
