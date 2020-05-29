import React from 'react';
import {
  Card,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import './TableCard.css';

const TableCard = ({ data, title }) => {
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
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  className="TableCard__Table__TableCell"
                  colSpan={4}
                  align="left"
                >
                  <div className="TableCard__Table__TableCell__Items">
                    <img src={item.imgUrl} alt="user" />
                    <p>{item.name}</p>
                  </div>
                </TableCell>
                <TableCell
                  className="TableCard__Table__TableCell"
                  align="left"
                  colSpan={2}
                >
                  {item.total > 999
                    ? (item.total / 1000).toFixed(1) + 'k'
                    : item.total}
                </TableCell>
                <TableCell className="TableCard__Table__TableCell" colSpan={1}>
                  <IconButton>
                    <EditIcon color="primary" />
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

export default TableCard;
