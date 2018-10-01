import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';

import SelectedCounter from '../../UI/SelectedCounter';
import IconButton from '../../UI/IconButton';
import messages from './EditToolbar.messages';
import './EditToolbar.css';

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
  onSaveBoardClick: PropTypes.func,
  onBoardTitleClick: PropTypes.func,
  board: PropTypes.object,
  /**
   * Callback fired when clicking on add button
   */
  onAddClick: PropTypes.func
};

function EditToolbar({
  board,
  className,
  classes,
  intl,
  isSelecting,
  isSaving,
  isLoggedIn,
  selectedItemsCount,
  onSelectClick,
  onDeleteClick,
  onEditClick,
  onSaveBoardClick,
  onBoardTitleClick,
  onAddClick
}) {
  const isItemsSelected = !!selectedItemsCount;

  return (
    <div
      className={classNames('EditToolbar', className, {
        'EditToolbar--selecting': isSelecting
      })}
    >
      {isSaving && (
        <span className="EditToolbar__BoardTitle">{board.name}</span>
      )}

      {!isSaving && (
        <a
          className={classNames('EditToolbar__BoardTitle', {
            'logged-in': isLoggedIn
          })}
          onClick={onBoardTitleClick}
        >
          {board.name}
        </a>
      )}

      <div className="EditToolbar__group EditToolbar__group--start">
        <IconButton
          label={intl.formatMessage(
            messages[isSelecting ? 'cancel' : 'select']
          )}
          onClick={onSelectClick}
          disabled={isSaving}
        >
          {isSelecting ? <DashboardOutlinedIcon /> : <DashboardIcon />}
        </IconButton>
        {isLoggedIn && (
          <IconButton
            label={intl.formatMessage(messages.saveBoard)}
            onClick={onSaveBoardClick}
            disabled={isSelecting || isSaving}
          >
            <SaveIcon />
          </IconButton>
        )}

        {isSaving && (
          <CircularProgress
            size={24}
            className="EditToolbar__Spinner"
            thickness={7}
          />
        )}

        {isSelecting && <SelectedCounter count={selectedItemsCount} />}
      </div>
      <div className="EditToolbar__group EditToolbar__group--end">
        {isSelecting && (
          <div>
            <IconButton
              label={intl.formatMessage(messages.deleteTiles)}
              disabled={!isItemsSelected}
              onClick={onDeleteClick}
            >
              <DeleteIcon />
            </IconButton>

            <IconButton
              label={intl.formatMessage(messages.editTiles)}
              disabled={!isItemsSelected}
              onClick={onEditClick}
            >
              <EditIcon />
            </IconButton>
          </div>
        )}
        {!isSelecting && (
          <div>
            <IconButton
              label={intl.formatMessage(messages.createTiles)}
              onClick={onAddClick}
              disabled={isSaving}
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
