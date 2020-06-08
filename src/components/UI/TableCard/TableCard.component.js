import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';
import StyledTable from '../StyledTable';
import './TableCard.css';

const propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

const TableCard = ({ data, title }) => {

  return (
    <Card elevation={3} className="TableCard">
      <div className="TableCard__Title">{title}</div>
      <StyledTable data={data} />
    </Card>
  );
};

TableCard.propTypes = propTypes;

export default TableCard;
