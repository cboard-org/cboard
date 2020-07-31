import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import CloseIcon from '@material-ui/icons/Close';

import {
  speak,
  cancelSpeech
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import './StyledTable.css';

const propTypes = {
  boards: PropTypes.array.isRequired,
  speak: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  tableHead: PropTypes.array.isRequired,
  isDense: PropTypes.bool
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 13,
    paddingRight: '6px',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    wordWrap: 'break-word'
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

const StyledTable = ({ data, tableHead, isDense, speak, boards }) => {
  const classes = useStyles();
  const [imageView, setImageView] = useState(false);

  const getTileFromLabel = (label) => {
    for (let i = 0; i < boards.length; i++) {
      for (let j = 0; j < boards[i].tiles.length; j++) {
        const tile = boards[i].tiles[j];
        if (
          (tile.label &&
            tile.label.trim().toLowerCase() === label.trim().toLowerCase()) ||
          (tile.labelKey &&
            tile.labelKey
              .split()[tile.labelKey.split().length - 1].trim()
              .toLowerCase() === label
                .trim()
                .replace(' ', '')
                .toLowerCase())
        ) {
          return tile;
        }
      }
    }
    return undefined;
  };

  const handleImageViewClose = () => {
    setImageView(false);
  }
  const handleRowAction = (item = {}) => {
    if (item.type === 'sound') {
      speak(item.name || '');
    }
    else if (item.type === 'view') {
      const tile = getTileFromLabel(item.name);
      if (tile) {
        setImageView({ ...tile, name: item.name });
      }
    }
  };

  return (
    <div className="StyledTable">
      <div className="StyledTable__Container">
        {!imageView && (
          <Table className="StyledTable__Table" size={isDense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow key="headRow">
                {tableHead && tableHead.length > 0 && tableHead.map((item, index) => (
                  <StyledTableCell
                    key={item}
                    colSpan={index === 0 ? 3 : 0}
                    align={index > 0 ? 'right' : 'left'}>
                    {item}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.length > 0 && data.map((item, index) => (
                <StyledTableRow key={item.name}>
                  <StyledTableCell colSpan="3" component="th" scope="row">
                    <div className="StyledTable__Table__StyledTableCell__Items">
                      {item.name}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {item.total > 999
                      ? (item.total / 1000).toFixed(1) + 'k'
                      : item.total}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      className={classes.root}
                      onClick={() => handleRowAction(item)}
                    >
                      {item.type === 'view'
                        ? <VisibilityIcon color="secondary" />
                        : <VolumeUpIcon color="secondary" />
                      }
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>)}
        {imageView && (
          <div className="StyledTable__ImageView">
            <IconButton onClick={handleImageViewClose}>
              <CloseIcon />
            </IconButton>
            <img alt={imageView.name} src={imageView.image} />
          </div>
        )}
      </div>
    </div>
  );
};

StyledTable.propTypes = propTypes;

const mapStateToProps = state => ({
  boards: state.board.boards
});

const mapDispatchToProps = {
  speak,
  cancelSpeech
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledTable);
