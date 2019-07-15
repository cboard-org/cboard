import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
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
   * If true, select all checkbox will be checked
   */
  isSelectAll: PropTypes.bool,
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
  onAddClick: PropTypes.func
};

function EditToolbar({
  board,
  className,
  classes,
  intl,
  isSelectAll,
  isSelecting,
  isSaving,
  isLoggedIn,
  selectedItemsCount,
  onSelectClick,
  onDeleteClick,
  onEditClick,
  onSelectAllToggle,
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
          onClick={onSelectClick}
          disabled={isSaving}
        >
          {isSelecting
            ? <DashboardOutlinedIcon
              className="EditToolbar__group EditToolbar__group--start--button" />
            : <DashboardIcon
              className="EditToolbar__group EditToolbar__group--start--button" />
           }
          {!isSelecting
            ? intl.formatMessage(messages.editTilesButton) 
            : ''
          }
        </Button>

        {isSaving && (
          <CircularProgress
            size={24}
            className="EditToolbar__Spinner"
            thickness={7}
          />
        )}

        {isSelecting && (
          <Fragment>
            <Checkbox checked={isSelectAll} onChange={onSelectAllToggle} />
            <SelectedCounter count={selectedItemsCount} />
          </Fragment>
        )}
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
              label={intl.formatMessage(messages.addTileButton)}
              onClick={onAddClick}
              disabled={isSaving}
              color='inherit'
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
