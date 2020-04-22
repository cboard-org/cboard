import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import FullScreenDialog, { FullScreenDialogContent } from '../FullScreenDialog';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import messages from './PrintBoardButton.messages';
import { CircularProgress } from '@material-ui/core';

import './PrintBoardDialog.css';

const PrintBoardDialog = ({
  title,
  open,
  loading,
  onClose,
  onPrintCurrentBoard
}) => (
  <FullScreenDialog
    disableSubmit={true}
    open={open}
    title={title}
    onClose={onClose}
  >
    <Paper>
      <FullScreenDialogContent className="PrintBoardDialog__container">
        <List>
          <ListItem>
            <ListItemText
              primary={<FormattedMessage {...messages.printBoard} />}
              secondary={<FormattedMessage {...messages.printBoardSecondary} />}
            />
          </ListItem>
          <ListItem>
            <ListItemSecondaryAction>
              {loading && (
                <CircularProgress
                  size={25}
                  className="PrintBoardDialog--spinner"
                  thickness={7}
                />
              )}
              <Button
                color="primary"
                variant="contained"
                onClick={onPrintCurrentBoard}
                disabled={loading}
              >
                <FormattedMessage {...messages.printCurrentBoard} />
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </FullScreenDialogContent>
    </Paper>
  </FullScreenDialog>
);

PrintBoardDialog.defaultProps = {
  open: false,
  loading: false,
  onClose: () => {},
  onPrintCurrentBoard: () => {}
};

PrintBoardDialog.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  onPrintCurrentBoard: PropTypes.func
};

export default PrintBoardDialog;
