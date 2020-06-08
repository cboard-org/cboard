import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import './TableCard.css';

const propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object
}

const useStyles = makeStyles({
  root: {
    'padding': '8px',
    'text-transform': 'capitalize'
  }
});

const handleRowAction = (item = {}) => {
  console.log(item);
};

const TableCard = ({ data, title }) => {
  const classes = useStyles();
  return (
    <Card elevation={3} className="TableCard">
      <div className="TableCard__Title">{title}</div>
      <div className="TableCard__Container">
        <Table className="TableCard__Table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4}>Name</TableCell>
              <TableCell colSpan={2}>Times clicked</TableCell>
              <TableCell colSpan={1}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 && data.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  className={classes.root}
                  colSpan={4}
                  align="left"
                >
                  <div className="TableCard__Table__TableCell__Items">
                    <p>{item.name}</p>
                  </div>
                </TableCell>
                <TableCell
                  className={classes.root}
                  align="left"
                  colSpan={2}
                >
                  {item.total > 999
                    ? (item.total / 1000).toFixed(1) + 'k'
                    : item.total}
                </TableCell>
                <TableCell className={classes.root} colSpan={1}>
                  <IconButton
                    className={classes.root}
                    onClick={() => handleRowAction(item)}
                  >
                    {item.type === 'view'
                      ? <VisibilityIcon color="secondary" />
                      : <VolumeUpIcon color="secondary" />
                    }
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

TableCard.propTypes = propTypes;
export default TableCard;
