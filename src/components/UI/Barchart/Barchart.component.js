import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import './Barchart.css';
import { Typography } from '@material-ui/core';

const Barchart = ({ data, title }) => {
  let max = 0;
  if (data && data[0]) {
    max = data[0].total;
  }
  return (
    <div>
      <Card className="Barchart__Card">
        <div className="Barchart__Card__Title">{title}</div>
        <Grid container direction="column" spacing={3}>
          {data.map(board => {
            return (
              <Grid className="Barchart__Item__Container" item key={board.name}>
                <Typography className="Barchart__Item__Name">
                  {board.name}
                </Typography>
                <div className="Barchart__Bar__Container">
                  <LinearProgress
                    className="Barchart__Bar"
                    variant="determinate"
                    value={Math.ceil((board.total / max) * 100)}
                  />
                  <Typography>{board.total}</Typography>
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
