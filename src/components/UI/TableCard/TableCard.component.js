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

const TableCard = () => {
  const productList = [
    {
      imgUrl: '/symbols/arasaac/goodbye.png',
      name: 'goodbye',
      price: 10000,
      available: 15
    },
    {
      imgUrl: '/symbols/arasaac/i_am.png',
      name: 'I am',
      price: 1500,
      available: 30
    },
    {
      imgUrl: '/symbols/arasaac/thanks.png',
      name: 'Thanks',
      price: 1900,
      available: 35
    },
    {
      imgUrl: '/symbols/arasaac/my.png',
      name: 'My',
      price: 100,
      available: 0
    },
    {
      imgUrl: '/symbols/arasaac/please.png',
      name: 'Please',
      price: 1190,
      available: 5
    }
  ];

  return (
    <Card elevation={3} className="TableCard">
      <div className="TableCard__Title">Top Used Buttons</div>
      <div className="TableCard__Container">
        <Table className="TableCard__Table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4}>Name</TableCell>
              <TableCell colSpan={2}>Times clicked</TableCell>
              <TableCell colSpan={2}>Times in phrase</TableCell>
              <TableCell colSpan={1}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index}>
                <TableCell
                  className="TableCard__Table__TableCell"
                  colSpan={4}
                  align="left"
                >
                  <div className="TableCard__Table__TableCell__Items">
                    <img src={product.imgUrl} alt="user" />
                    <p>{product.name}</p>
                  </div>
                </TableCell>
                <TableCell
                  className="TableCard__Table__TableCell"
                  align="left"
                  colSpan={2}
                >
                  {product.price > 999
                    ? (product.price / 1000).toFixed(1) + 'k'
                    : product.price}
                </TableCell>

                <TableCell
                  className="TableCard__Table__TableCell"
                  align="left"
                  colSpan={2}
                >
                  {product.available}
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
