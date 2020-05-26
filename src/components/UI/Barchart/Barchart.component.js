import React, { Fragment } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import './Barchart.css';
import { Typography } from '@material-ui/core';

const Barchart = () => {
  const data = [
    {
      name: 'home',
      times: 65
    },
    {
      name: 'homeuuuu',
      times: 25
    }
  ];
  return (
    <div>
      <Card className="Barchart__Card">
        <div className="Barchart__Card__Title">Most used Boards</div>
        <Grid container direction="column" spacing={3}>
          {data.map(board => {
            return (
              <Grid item>
                <div>
                  <Typography>{board.name}</Typography>
                  <div className="Barchart__Bar__Container">
                    <LinearProgress
                      className="Barchart__Bar"
                      variant="determinate"
                      value={board.times}
                    />
                    <Typography>{board.times}</Typography>
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </div>
  );
};

export default Barchart;
