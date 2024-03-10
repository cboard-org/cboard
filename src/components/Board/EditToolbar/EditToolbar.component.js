import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { MdContentCopy } from 'react-icons/md';
import { MdContentPaste } from 'react-icons/md';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SelectedCounter from '../../UI/SelectedCounter';
import IconButton from '../../UI/IconButton';
import messages from './EditToolbar.messages';
import './EditToolbar.css';
import { FormControlLabel } from '@material-ui/core';
import PremiumFeature from '../../PremiumFeature';

EditToolbar.propTypes = {
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * @ignore
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * If true, select all checkbox will be checked
   */
  isSelectAll: PropTypes.bool,
  isFixedBoard: PropTypes.bool,
  /**
   * Used to show a second Toolbar -- Todo: rename for seperation
   */
  isSelecting: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  /**
   * Used to render how many items were selected in selection mode
   */
  selectedItemsCount: PropTypes.number.isRequired,
  /**
   * Callback fired when clicking on select button
   */
  onSelectClick: PropTypes.func,
  /**
   * Callback fired when clicking on delete button
   */
  onDeleteClick: PropTypes.func,
  /**
   * Callback fired when clicking on edit button
   */
  onEditClick: PropTypes.func,
  /**
   * Callback fired when clicking on select all checkbox
   */
  onSelectAllToggle: PropTypes.func,
  onBoardTitleClick: PropTypes.func,
  board: PropTypes.object,
  /**
   * Callback fired when clicking on add button
   */
  onAddClick: PropTypes.func,
  onBoardTypeChange: PropTypes.func,
  copiedTiles: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDialogAccecpted: PropTypes.func.isRequired
};

function EditToolbar({
  board,
  className,
  classes,
  intl,
  isSelectAll,
  isSelecting,
  isFixedBoard,
  isSaving,
  isLoggedIn,
  selectedItemsCount,
  onSelectClick,
  onDeleteClick,
  onEditClick,
  onSelectAllToggle,
  onBoardTitleClick,
  onAddClick,
  onBoardTypeChange,
  onCopyTiles,
  onPasteTiles,
  copiedTiles
}) {
  const isItemsSelected = !!selectedItemsCount;
  const isFixed = !!isFixedBoard;
  const [openDeleteTiles, setOpenDeleteTiles] = useState(false);
  const handleClickOpen = () => {
    setOpenDeleteTiles(true);
  };
  const handleClose = () => {
    setOpenDeleteTiles(false);
  };

  return (
    <div
      className={classNames('EditToolbar', className, {
        'EditToolbar--selecting': isSelecting
      })}
    >
      {(isSaving || !isLoggedIn) && (
        <span className="EditToolbar__BoardTitle">{board.name}</span>
      )}

      {!isSaving && isLoggedIn && (
        <Button
          className={classNames('EditToolbar__BoardTitle', {
            'logged-in': isLoggedIn
          })}
          onClick={onBoardTitleClick}
        >
          {board.name}
        </Button>
      )}

      <div className="EditToolbar__group EditToolbar__group--start">
        <Button
          label={intl.formatMessage(
            messages[isSelecting ? 'cancel' : 'editTilesButton']
          )}
          id="edit-board-tiles"
          aria-label="edit-board-tiles"
          onClick={onSelectClick}
          disabled={isSaving}
          className={'edit__board__ride'}
        >
          {isSelecting ? (
            <DashboardOutlinedIcon className="EditToolbar__group EditToolbar__group--start--button" />
          ) : (
            <DashboardIcon className="EditToolbar__group EditToolbar__group--start--button" />
          )}
          {!isSelecting ? intl.formatMessage(messages.editTilesButton) : ''}
        </Button>

        {isSelecting && (
          <Fragment>
            <FormControlLabel
              control={
                <Switch
                  checked={isFixed}
                  onChange={onBoardTypeChange}
                  name="switchFixedBoard"
                  color="secondary"
                />
              }
              label={intl.formatMessage(messages.fixedBoard)}
            />
          </Fragment>
        )}

        {isSaving && (
          <CircularProgress
            size={24}
            className="EditToolbar__Spinner"
            thickness={7}
          />
        )}
      </div>
      <div className="EditToolbar__group EditToolbar__group--end">
        {isSelecting && (
          <Fragment>
            <Checkbox checked={isSelectAll} onChange={onSelectAllToggle} />
            <SelectedCounter
              count={selectedItemsCount}
              className="EditToolbar__SelectedCounter"
            />
            <IconButton
              label={intl.formatMessage(messages.deleteTiles)}
              disabled={!isItemsSelected}
              onClick={() => {
                handleClickOpen();
              }}
            >
              <DeleteIcon />
            </IconButton>
            <Dialog open={openDeleteTiles} onClose={handleClose}>
              <DialogTitle id="alert-dialog-title">
                {intl.formatMessage(messages.deleteTileTitle)}
              </DialogTitle>
              <DialogContent>
                {intl.formatMessage(messages.deleteTileDescription)}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {intl.formatMessage(messages.deleteTileCancel)}
                </Button>
                <Button
                  onClick={onDeleteClick}
                  variant="contained"
                  color="primary"
                  autoFocus
                >
                  {intl.formatMessage(messages.deleteTileOk)}
                </Button>
              </DialogActions>
            </Dialog>

            <PremiumFeature>
              <IconButton
                label={intl.formatMessage(messages.copyTiles)}
                disabled={!isItemsSelected}
                onClick={onCopyTiles}
              >
                <MdContentCopy />
              </IconButton>
              <IconButton
                label={intl.formatMessage(messages.pasteTiles)}
                disabled={!copiedTiles.length}
                onClick={onPasteTiles}
              >
                <MdContentPaste />
              </IconButton>
            </PremiumFeature>
            <IconButton
              label={intl.formatMessage(messages.editTiles)}
              disabled={!isItemsSelected}
              onClick={onEditClick}
            >
              <EditIcon />
            </IconButton>
          </Fragment>
        )}
        {!isSelecting && (
          <div className={'add__board__tile'}>
            <IconButton
              label={intl.formatMessage(messages.addTileButton)}
              onClick={onAddClick}
              disabled={isSaving}
              color="inherit"
            >
              <AddBoxIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default injectIntl(EditToolbar);
