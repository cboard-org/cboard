import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';

import Bar from '../../UI/Bar';
import SelectedCounter from '../../UI/SelectedCounter';
import IconButton from '../../UI/IconButton';
import messages from './EditToolBar.messages';
import './EditToolBar.css';

class EditToolbar extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Used to show a second Toolbar -- Todo: rename for seperation
     */
    isSelecting: PropTypes.bool,
    /**
     * Callback fired when clicking on add button
     */
    onCreateClick: PropTypes.func,
    /**
     * Callback fired when clicking on delete button
     */
    onDeleteClick: PropTypes.func,
    /**
     * Callback fired when clicking on edit button
     */
    onEditClick: PropTypes.func,
    /**
     * Callback fired when clicking on select button
     */
    onSelectClick: PropTypes.func,
    /**
     * Used to render how many items were selected in selection mode
     */
    selectedItemsCount: PropTypes.number.isRequired
  };

  render() {
    const {
      className,
      intl,
      isSelecting,
      onCreateClick,
      onDeleteClick,
      onEditClick,
      onSelectClick,
      onToggleSelectAll,
      selectChecked,
      selectedItemsCount
    } = this.props;

    const isItemsSelected = !!selectedItemsCount;

    const groupStart = (
      <Fragment>
        <Button color="inherit" onClick={onSelectClick}>
          {!isSelecting && <FormattedMessage {...messages.select} />}
          {isSelecting && <FormattedMessage {...messages.cancel} />}
        </Button>
      </Fragment>
    );

    const groupMiddle = (
      <Fragment>
        {isSelecting && (
          <SelectedCounter
            checked={selectChecked}
            count={selectedItemsCount}
            onToggleSelectAll={onToggleSelectAll}
          />
        )}
      </Fragment>
    );

    const groupEnd = (
      <Fragment>
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
              onClick={onCreateClick}
            >
              <AddBoxIcon />
            </IconButton>
          </div>
        )}
      </Fragment>
    );

    const editToolBarClassName = classNames('EditToolBar', className, {
      'EditToolBar--selecting': isSelecting
    });

    return (
      <Bar
        className={editToolBarClassName}
        groupStart={groupStart}
        groupMiddle={groupMiddle}
        groupEnd={groupEnd}
      />
    );
  }
}

export default injectIntl(EditToolbar);
