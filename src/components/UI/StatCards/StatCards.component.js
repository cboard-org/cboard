import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, IconButton, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import SpellCheckIcon from '@material-ui/icons/Spellcheck';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import EditIcon from '@material-ui/icons/Edit';

import './StatCards.css';


const propTypes = {
  classes: PropTypes.object.isRequired,
  onDetailsClick: PropTypes.func.isRequired,
  data: PropTypes.object
}

const styles = theme => ({
  icon: {
    fontSize: '44px',
    opacity: 0.6,
    color: theme.palette.primary.main
  }
});

const StatCards = ({ classes, data, onDetailsClick }) => {
  return (
    <div className="StatCards">
      <Grid container spacing={3} className="StatCards__Container">
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={3}>
            <div className="StatCards__Card__Items">
              <SpellCheckIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                {data.words['title']}
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.words['total']}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton onClick={onDetailsClick('words')}>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={3}>
            <div className="StatCards__Card__Items">
              <RecordVoiceOverIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                {data.phrases['title']}
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.phrases['total']}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton onClick={onDetailsClick('phrases')}>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={3}>
            <div className="StatCards__Card__Items">
              <ViewModuleIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                {data.boards['title']}
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.boards['total']}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton onClick={onDetailsClick('boards')}>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="StatCards__Card" elevation={3}>
            <div className="StatCards__Card__Items">
              <EditIcon className={classes.icon} />
              <div className="StatCards__Card__Items__Text">
                <small className="StatCards__Card__Items__Text__Label">
                {data.editions['title']}
                </small>
                <h6 className="StatCards__Card__Items__Text__Value">
                  {data.editions['total']}
                </h6>
              </div>
            </div>
            <Tooltip title="View Details" placement="top">
              <IconButton onClick={onDetailsClick('editions')}>
                <ArrowRightAltIcon />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

StatCards.propTypes = propTypes;
export default withStyles(styles, { withTheme: true })(StatCards);
