import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddBoxIcon from 'material-ui-icons/AddBox';

import SelectedCounter from '../../UI/SelectedCounter';
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
  /**
   * Used to render how many items were selected in selection mode
   */
  numberOfItemsSelected: PropTypes.number.isRequired,
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
   * Callback fired when clicking on add button
   */
  onAddClick: PropTypes.func
};

function EditToolbar({
  className,
  classes,
  intl,
  isSelecting,
  numberOfItemsSelected,
  onSelectClick,
  onDeleteClick,
  onEditClick,
  onAddClick
}) {
  const isItemsSelected = !!numberOfItemsSelected;

  return (
    <div
      className={classNames('EditToolbar', className, {
        'EditToolbar--selecting': isSelecting
      })}
    >
      <div className="EditToolbar__group EditToolbar__group--start">
        <Button color="inherit" onClick={onSelectClick}>
          {!isSelecting && <FormattedMessage {...messages.select} />}
          {isSelecting && <FormattedMessage {...messages.cancel} />}
        </Button>
      </div>
      <div className="EditToolbar__group EditToolbar__group--middle">
        {isSelecting && (
          <SelectedCounter
            count={numberOfItemsSelected}
            text={intl.formatMessage(messages.itemsSelected)}
          />
        )}
      </div>
      <div className="EditToolbar__group EditToolbar__group--end">
        {isSelecting && (
          <div>
            <Tooltip
              title={intl.formatMessage(messages.delete)}
              placement="bottom"
            >
              <IconButton
                focusRipple={true}
                aria-label={intl.formatMessage(messages.delete)}
                disabled={!isItemsSelected}
                onClick={onDeleteClick}
                color="inherit"
                style={{
                  opacity: isItemsSelected ? 1 : 0.3
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={intl.formatMessage(messages.edit)}
              placement="bottom"
            >
              <IconButton
                focusRipple={true}
                aria-label={intl.formatMessage(messages.edit)}
                disabled={!isItemsSelected}
                onClick={onEditClick}
                color="inherit"
                style={{
                  opacity: isItemsSelected ? 1 : 0.3
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {!isSelecting && (
          <div>
            <Tooltip
              title={intl.formatMessage(messages.add)}
              placement="bottom"
            >
              <IconButton
                focusRipple={true}
                aria-label={intl.formatMessage(messages.add)}
                color="inherit"
                onClick={onAddClick}
              >
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

export default injectIntl(EditToolbar);
