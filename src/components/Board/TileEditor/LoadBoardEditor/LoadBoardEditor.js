import React, { Fragment } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputBase
} from '@material-ui/core';
import { Edit, Search as SearchIcon, Visibility } from '@material-ui/icons';
import useAllBoardsFetcher from './useAllBoardsFetcher';
import styles from './LoadBoardEditor.module.css';
import { Alert, AlertTitle, Pagination } from '@material-ui/lab';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import communicatorMessages from '../../../Communicator/CommunicatorDialog/CommunicatorDialog.messages';
import messages from './LoadBoardEditor.messages';
import moment from 'moment';
import { isCordova } from '../../../../cordova-util';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'sticky'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BoardPagination = ({ pagesCount, currentPage, handleChange }) => {
  return (
    <div className={styles.pagination}>
      <Pagination
        count={pagesCount}
        color="primary"
        size="large"
        page={currentPage}
        onChange={handleChange}
      />
    </div>
  );
};

const BoardInfoContent = ({ intl, pageBoards, selectedBoardId }) => {
  const board = pageBoards.find(({ id }) => id === selectedBoardId);
  const boardUrl =
    window.location.origin +
    '/' +
    window.location.pathname.split('/')[1] +
    '/' +
    board.id;

  return (
    <DialogContent>
      <DialogContentText>
        <Typography variant="body1" gutterBottom>
          <b>{intl.formatMessage(communicatorMessages.boardInfoName)}:</b>{' '}
          {board.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>{intl.formatMessage(communicatorMessages.boardDescription)}:</b>{' '}
          {board.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>{intl.formatMessage(communicatorMessages.boardInfoDate)}:</b>{' '}
          {moment(board.lastEdited).format('DD/MM/YYYY')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>{intl.formatMessage(communicatorMessages.boardInfoTiles)}:</b>{' '}
          {board.tiles.length}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <b>{intl.formatMessage(communicatorMessages.boardInfoId)}:</b>{' '}
          {board.id}
        </Typography>
        {!isCordova() && (
          <Button
            variant="outlined"
            target="_blank"
            href={boardUrl}
            startIcon={<Visibility />}
          >
            {intl.formatMessage(messages.openBoardInNewTab)}
          </Button>
        )}
      </DialogContentText>
    </DialogContent>
  );
};

const LoadBoardEditor = ({ intl, onLoadBoardChange, isLostedFolder }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const {
    pageBoards,
    totalPages,
    loading,
    error,
    fetchBoards
  } = useAllBoardsFetcher();
  const [currentPage, setCurrentPage] = React.useState(1);

  const BoardsList = ({ onItemClick }) => {
    return (
      <List className={styles.boardsList}>
        {pageBoards?.map(({ id, name, lastEdited }) => (
          <Fragment key={id}>
            <ListItem button onClick={() => onItemClick(id)}>
              <ListItemText
                primary={name}
                secondary={`${intl.formatMessage(
                  communicatorMessages.boardInfoDate
                )}: ${moment(lastEdited).format('DD/MM/YYYY')}`}
              />
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    );
  };

  const handleClickOpen = () => {
    fetchBoards({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeOnPage = (event, page) => {
    setCurrentPage(page);
    fetchBoards({ page });
  };

  const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState(
    false
  );
  const [selectedBoardId, setSelectedBoardId] = React.useState(null);

  const handleOnItemClick = boardId => {
    setSelectedBoardId(boardId);
    setOpenConfirmationDialog(true);
  };

  return (
    <>
      {!isLostedFolder ? (
        <IconButton
          variant="outlined"
          color="primary"
          onClick={handleClickOpen}
        >
          <Edit />
        </IconButton>
      ) : (
        <Button
          startIcon={<SearchIcon />}
          variant="outlined"
          color="primary"
          onClick={handleClickOpen}
          className={styles.searchButton}
        >
          {intl.formatMessage(messages.searchFolder)}
        </Button>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={onSearchChange}
              />
            </div>
          </Toolbar>
        </AppBar>
        <div className={styles.boardsListContainer}>
          <BoardPagination
            handleChange={handleChangeOnPage}
            pagesCount={totalPages}
            currentPage={currentPage}
          />
          {loading && (
            <div className={styles.loaderContainer}>
              <CircularProgress />
            </div>
          )}
          {error && (
            <Alert severity="error">
              <AlertTitle>Error getting all your folders</AlertTitle>
              <Button color="primary" onClick={fetchBoards}>
                Try Again
              </Button>
            </Alert>
          )}
          {!loading && !error && <BoardsList onItemClick={handleOnItemClick} />}
          <BoardPagination
            handleChange={handleChangeOnPage}
            pagesCount={totalPages}
            currentPage={currentPage}
          />
        </div>
      </Dialog>
      <Dialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {intl.formatMessage(messages.confirmationTitle)}
        </DialogTitle>
        <BoardInfoContent
          intl={intl}
          pageBoards={pageBoards}
          selectedBoardId={selectedBoardId}
        />
        <DialogActions>
          <Button
            color="primary"
            onClick={() => setOpenConfirmationDialog(false)}
          >
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              onLoadBoardChange({ boardId: selectedBoardId });
              setOpenConfirmationDialog(false);
              setOpen(false);
            }}
          >
            {intl.formatMessage(messages.accept)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

LoadBoardEditor.propTypes = {
  intl: intlShape,
  onLoadBoardChange: PropTypes.func,
  isLostedFolder: PropTypes.bool
};

export default LoadBoardEditor;
