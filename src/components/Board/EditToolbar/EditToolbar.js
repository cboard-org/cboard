import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddBoxIcon from 'material-ui-icons/AddBox';
import SettingsIcon from 'material-ui-icons/Settings';

import SelectedCounter from '../../SelectedCounter';
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
  onAddClick: PropTypes.func,
  /**
   * Callback fired when clicking on settings button
   */
  onSettingsClick: PropTypes.func
};

const styles = {
  keyboardFocused: {
    backgroundColor: 'rgba(0,0,0,0)'
  }
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
  onAddClick,
  onSettingsClick
}) {
  const isItemsSelected = !!numberOfItemsSelected;

  return (
    <div
      className={classNames('EditToolbar', className, {
        'EditToolbar--selecting': isSelecting
      })}
    >
      <div className="EditToolbar__group EditToolbar__group--start">
        <Button color="contrast" onClick={onSelectClick}>
          {!isSelecting && <FormattedMessage {...messages.select} />}
          {isSelecting && <FormattedMessage {...messages.cancel} />}
        </Button>
        {isSelecting && (
          <SelectedCounter
            count={numberOfItemsSelected}
            text="items selected"
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
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.delete)}
                disabled={!isItemsSelected}
                onClick={onDeleteClick}
                color="contrast"
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
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.edit)}
                disabled={!isItemsSelected}
                onClick={onEditClick}
                color="contrast"
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
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.add)}
                color="contrast"
                onClick={onAddClick}
              >
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={intl.formatMessage(messages.settings)}
              placement="bottom"
            >
              <IconButton
                focusRipple={true}
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.settings)}
                color="contrast"
                onClick={onSettingsClick}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

export default injectIntl(
  withStyles(styles, { name: 'EditToolbar' })(EditToolbar)
);
