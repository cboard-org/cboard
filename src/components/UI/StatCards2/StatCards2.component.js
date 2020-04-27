import React from 'react';
import { Grid, Card, Fab } from '@material-ui/core';
import NavigationIcon from '@material-ui/icons/Navigation';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import EditIcon from '@material-ui/icons/Edit';
import './StatCards2.css';

const StatCards2 = () => {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      className="StatCards2__Container"
    >
      <Grid item>
        <Card elevation={3} className="StatCards2__Card">
          <div className="StatCards2__Card__Items">
            <Fab size="medium" color="primary">
              <NavigationIcon />
            </Fab>
            <h4 className="StatCards2__Card__Items__text">Navigation Events</h4>
          </div>
          <h1 className="StatCards2__Card__Value">10.8k</h1>
        </Card>
      </Grid>
      <Grid item>
        <Card elevation={3} className="StatCards2__Card">
          <div className="StatCards2__Card__Items">
            <Fab size="medium" color="primary">
              <RecordVoiceOverIcon />
            </Fab>
            <h4 className="StatCards2__Card__Items__text">Speech Events</h4>
          </div>
          <h1 className="StatCards2__Card__Value">2.8K</h1>
        </Card>
      </Grid>
      <Grid item>
        <Card elevation={3} className="StatCards2__Card">
          <div className="StatCards2__Card__Items">
            <Fab size="medium" color="primary">
              <EditIcon />
            </Fab>
            <h4 className="StatCards2__Card__Items__text">Editing Events</h4>
          </div>
          <h1 className="StatCards2__Card__Value">348</h1>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
