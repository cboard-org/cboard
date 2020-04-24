import React from 'react';
import {
  Card,
  Icon,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';

const TableCard = () => {
  const productList = [
    {
      imgUrl: '/assets/images/goodbye.png',
      name: 'goodbye',
      price: 10000,
      available: 15
    },
    {
      imgUrl: '/assets/images/i_am.png',
      name: 'I am',
      price: 1500,
      available: 30
    },
    {
      imgUrl: '/assets/images/thanks.png',
      name: 'Thanks',
      price: 1900,
      available: 35
    },
    {
      imgUrl: '/assets/images/my.png',
      name: 'My',
      price: 100,
      available: 0
    },
    {
      imgUrl: '/assets/images/please.png',
      name: 'Please',
      price: 1190,
      available: 5
    }
  ];

  return (
    <Card elevation={3} className="pt-5 mb-6">
      <div className="card-title px-6 mb-3">Top Used Buttons</div>
      <div className="overflow-auto">
        <Table className="product-table">
          <TableHead>
            <TableRow>
              <TableCell className="px-6" colSpan={4}>
                Name
              </TableCell>
              <TableCell className="px-0" colSpan={2}>
                Times clicked
              </TableCell>
              <TableCell className="px-0" colSpan={2}>
                Times in phrase
              </TableCell>
              <TableCell className="px-0" colSpan={1}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="px-0 capitalize" colSpan={4} align="left">
                  <div className="flex items-center">
                    <img
                      className="circular-image-small"
                      src={product.imgUrl}
                      alt="user"
                    />
                    <p className="m-0 ml-8">{product.name}</p>
                  </div>
                </TableCell>
                <TableCell className="px-0 capitalize" align="left" colSpan={2}>
                  {product.price > 999
                    ? (product.price / 1000).toFixed(1) + 'k'
                    : product.price}
                </TableCell>

                <TableCell className="px-0" align="left" colSpan={2}>
                  {product.available}
                </TableCell>
                <TableCell className="px-0" colSpan={1}>
                  <IconButton>
                    <Icon color="primary">edit</Icon>
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
