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

const StatCards = ({ classes }) => {
  return (
    <Grid container spacing={3} className="Grid">
      <Grid item xs={12} md={6}>
        <Card className="play-card" elevation={6}>
          <div className="Items">
            <SpellCheckIcon className={classes.icon} />
            <div className="ml-3">
              <small className="text-muted">Total words</small>
              <h6 className="m-0 mt-1 text-primary font-medium">3050</h6>
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
        <Card className="play-card" elevation={6}>
          <div className="Items">
            <RecordVoiceOverIcon className={classes.icon} />
            <div className="ml-3">
              <small className="text-muted">Total phrases</small>
              <h6 className="m-0 mt-1 text-primary font-medium">55</h6>
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
        <Card className="play-card" elevation={6}>
          <div className="Items">
            <ViewModuleIcon className={classes.icon} />
            <div className="ml-3">
              <small className="text-muted">Boards used</small>
              <h6 className="m-0 mt-1 text-primary font-medium">15</h6>
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
        <Card className="play-card" elevation={6}>
          <div className="Items">
            <EditIcon className={classes.icon} />
            <div className="ml-3">
              <small className="text-muted">Boards edited</small>
              <h6 className="m-0 mt-1 text-primary font-medium">30</h6>
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
  );
};

export default withStyles(styles, { withTheme: true })(StatCards);
