import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddBoxIcon from 'material-ui-icons/AddBox';
import SettingsIcon from 'material-ui-icons/Settings';

import messages from './messages';
import './EditToolbar.css';

const styles = {
  keyboardFocused: {
    backgroundColor: 'rgba(0,0,0,0)'
  }
};

class EditToolbar extends PureComponent {
  state = { isSelecting: false };

  handleSelectClick = () => {
    const { onSelectClick } = this.props;
    const isSelecting = !this.state.isSelecting;
    this.setState({ isSelecting });
    onSelectClick(isSelecting);
  };

  render() {
    const {
      className,
      classes,
      intl,
      isItemsSelected,
      onDeleteClick,
      onEditClick,
      onAddClick,
      onSettingsClick
    } = this.props;

    return (
      <div className={classNames(className, 'EditToolbar')}>
        <div className="EditToolbar__group EditToolbar__group--start">
          <Button color="contrast" onClick={this.handleSelectClick}>
            {!this.state.isSelecting && (
              <FormattedMessage {...messages.select} />
            )}
            {this.state.isSelecting && (
              <FormattedMessage {...messages.cancel} />
            )}
          </Button>
        </div>
        <div className="EditToolbar__group EditToolbar__group--end">
          {this.state.isSelecting && (
            <div>
              <IconButton
                focusRipple={true}
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.delete)}
                title={intl.formatMessage(messages.delete)}
                disabled={!isItemsSelected}
                onClick={onDeleteClick}
                color="contrast"
                style={{
                  opacity: isItemsSelected ? 1 : 0.3
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                focusRipple={true}
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.edit)}
                title={intl.formatMessage(messages.edit)}
                disabled={!isItemsSelected}
                onClick={onEditClick}
                color="contrast"
                style={{
                  opacity: isItemsSelected ? 1 : 0.3
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
          )}
          {!this.state.isSelecting && (
            <div>
              <IconButton
                focusRipple={true}
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.add)}
                title={intl.formatMessage(messages.add)}
                color="contrast"
                onClick={onAddClick}
              >
                <AddBoxIcon />
              </IconButton>
              <IconButton
                focusRipple={true}
                classes={{ keyboardFocused: classes.keyboardFocused }}
                aria-label={intl.formatMessage(messages.settings)}
                title={intl.formatMessage(messages.settings)}
                color="contrast"
                onClick={onSettingsClick}
              >
                <SettingsIcon />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    );
  }
}

EditToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  intl: intlShape.isRequired,
  isItemsSelected: PropTypes.bool,
  onSelectClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onSettingsClick: PropTypes.func
};

EditToolbar.defaultProps = {
  className: ''
};

export default injectIntl(
  withStyles(styles, { name: 'EditToolbar' })(EditToolbar)
);
