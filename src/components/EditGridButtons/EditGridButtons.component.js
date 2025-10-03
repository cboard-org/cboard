import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import './EditGridButtons.css';

class EditGridButtons extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    onAddRemoveColumn: PropTypes.func.isRequired,
    onAddRemoveRow: PropTypes.func.isRequired,
    position: PropTypes.string
  };

  static defaultProps = {
    position: 'toolbar-left'
  };

  onAddRemoveColumn = (isAdd, isLeftOrTop) => {
    this.props.onAddRemoveColumn(isAdd, isLeftOrTop);
  };

  onAddRemoveRow = (isAdd, isLeftOrTop) => {
    this.props.onAddRemoveRow(isAdd, isLeftOrTop);
  };

  renderColumnButtons = () => {
    const { columns } = this.props;
    return (
      <ButtonGroup
        orientation="horizontal"
        color="primary"
        aria-label="edit_grid_column_buttons"
        size="small"
        variant="contained"
      >
        <Button
          onClick={() => this.onAddRemoveColumn(false, false)}
          aria-label="remove_column"
        >
          <KeyboardArrowLeftIcon />
        </Button>
        <Button aria-label="column_count" disabled>
          {columns}
        </Button>
        <Button
          onClick={() => this.onAddRemoveColumn(true, false)}
          aria-label="add_column"
        >
          <KeyboardArrowRightIcon />
        </Button>
      </ButtonGroup>
    );
  };

  renderRowButtons = () => {
    const { rows } = this.props;
    return (
      <ButtonGroup
        orientation="horizontal"
        color="primary"
        aria-label="edit_grid_row_buttons"
        size="small"
        variant="contained"
      >
        <Button
          onClick={() => this.onAddRemoveRow(false, false)}
          aria-label="remove_row"
        >
          <KeyboardArrowUpIcon />
        </Button>
        <Button aria-label="row_count" disabled>
          {rows}
        </Button>
        <Button
          onClick={() => this.onAddRemoveRow(true, false)}
          aria-label="add_row"
        >
          <KeyboardArrowDownIcon />
        </Button>
      </ButtonGroup>
    );
  };

  render() {
    const { active, position } = this.props;
    if (!active) {
      return null;
    }

    return (
      <div className={`EditGridButtons ${position}`}>
        <div className="button-container">
          {this.renderRowButtons()}
          {this.renderColumnButtons()}
        </div>
      </div>
    );
  }
}

export default EditGridButtons;
