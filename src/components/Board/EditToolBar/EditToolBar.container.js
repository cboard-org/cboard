import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import {
  hideNotification,
  showNotification
} from '../../Notifications/Notifications.actions';

import {
  deleteTiles,
  deselectAllTiles,
  selectAllTiles,
  toggleSelect
} from '../Board.actions';

import messages from './EditToolBar.messages';
import EditToolBar from './EditToolBar';

export class EditToolBarContainer extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape
  };

  resetSelect() {
    const { deselectAllTiles, toggleSelect } = this.props;
    deselectAllTiles();
    toggleSelect();
  }

  handleDeleteClick = () => {
    const { deleteTiles, intl, selectedTileIds, showNotification } = this.props;

    deleteTiles(selectedTileIds);
    this.resetSelect();
    showNotification(intl.formatMessage(messages.tilesDeleted));
  };

  handleEditClick = () => {
    const { onEditClick, toggleSelect } = this.props;
    onEditClick();
    toggleSelect();
  };

  handleSelectClick = () => {
    this.resetSelect();
  };

  handleToggleSelectAll = () => {
    const { deselectAllTiles, selectAllTiles, selectChecked } = this.props;

    if (selectChecked) {
      deselectAllTiles();
    } else {
      selectAllTiles();
    }
  };

  render() {
    const {
      selectChecked,
      isSelecting,
      onCreateClick,
      selectedTileIds
    } = this.props;

    return (
      <EditToolBar
        isSelecting={isSelecting}
        selectedItemsCount={selectedTileIds.length}
        selectChecked={selectChecked}
        onCreateClick={onCreateClick}
        onDeleteClick={this.handleDeleteClick}
        onEditClick={this.handleEditClick}
        onSelectClick={this.handleSelectClick}
        onToggleSelectAll={this.handleToggleSelectAll}
      />
    );
  }
}

const mapStateToProps = ({ board }) => {
  const activeBoard = board.boards.find(b => b.id === board.activeBoardId);
  const selectChecked = Boolean(
    activeBoard.tiles.length &&
      activeBoard.tiles.length === board.selectedTileIds.length
  );

  return {
    selectChecked,
    isSelecting: board.tileSelectable,
    selectedTileIds: board.selectedTileIds
  };
};

const mapDispatchToProps = {
  deleteTiles,
  deselectAllTiles,
  hideNotification,
  selectAllTiles,
  showNotification,
  toggleSelect
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(EditToolBarContainer));
