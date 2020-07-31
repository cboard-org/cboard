import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';
import StyledTable from '../StyledTable';
import './TableCard.css';

const propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  tableHead: PropTypes.array.isRequired,
}

const TableCard = ({ data, tableHead, title }) => {

  return (
    <Card elevation={3} className="TableCard">
      <div className="TableCard__Title">{title}</div>
      <StyledTable isDense={true} data={data} tableHead={tableHead} />
    </Card>
  );
};

TableCard.propTypes = propTypes;

export default TableCard;
