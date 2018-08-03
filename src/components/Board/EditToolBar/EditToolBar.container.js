import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  createTile,
  deleteTiles,
  deselectAllTiles,
  editTiles,
  selectAllTiles,
  toggleSelect
} from '../Board.actions';
import EditToolBar from './EditToolBar';

export class EditToolBarContainer extends Component {
  static propTypes = {};

  handleDeleteClick = () => {
    const { deleteTiles, deselectAllTiles, toggleSelect } = this.props;
    deleteTiles();
    deselectAllTiles();
    toggleSelect();
  };

  handleSelectClick = () => {
    const { deselectAllTiles, toggleSelect } = this.props;
    deselectAllTiles();
    toggleSelect();
  };

  handleToggleSelectAll = () => {
    const { deselectAllTiles, selectAllTiles, allItemsSelected } = this.props;
    if (allItemsSelected) {
      deselectAllTiles();
    } else {
      selectAllTiles();
    }
  };

  render() {
    const {
      allItemsSelected,
      isSelecting,
      selectedTileIds,
      createTile,
      editTiles
    } = this.props;

    return (
      <EditToolBar
        isSelecting={isSelecting}
        selectedItemsCount={selectedTileIds.length}
        selectChecked={allItemsSelected}
        onCreateClick={createTile}
        onDeleteClick={this.handleDeleteClick}
        onEditClick={editTiles}
        onSelectClick={this.handleSelectClick}
        onToggleSelectAll={this.handleToggleSelectAll}
      />
    );
  }
}

const mapStateToProps = ({ board }) => {
  const activeBoard = board.boards.find(b => b.id === board.activeBoardId);

  return {
    allItemsSelected:
      activeBoard.tiles.length &&
      activeBoard.tiles.length === board.selectedTileIds.length,
    isSelecting: board.tileSelectable,
    selectedTileIds: board.selectedTileIds
  };
};

const mapDispatchToProps = {
  createTile,
  deleteTiles,
  deselectAllTiles,
  editTiles,
  selectAllTiles,
  toggleSelect
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditToolBarContainer);
