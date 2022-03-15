import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import DeleteIcon from '@material-ui/icons/Delete';
import InputIcon from '@material-ui/icons/Input';
import ClearIcon from '@material-ui/icons/Clear';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import QueueIcon from '@material-ui/icons/Queue';
import FlagIcon from '@material-ui/icons/Flag';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slide from '@material-ui/core/Slide';
import DialogContentText from '@material-ui/core/DialogContentText';

import IconButton from '../../UI/IconButton';
import { TAB_INDEXES } from './CommunicatorDialog.constants';
import messages from './CommunicatorDialog.messages';
import { isCordova } from '../../../cordova-util';
import InputImage from '../../UI/InputImage';
import SymbolSearch from '../../Board/SymbolSearch';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultReportDialogState = {
  openBoardReport: false,
  reportReason: '',
  loading: false,
  error: false,
  success: false
};

class CommunicatorDialogBoardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,

      reportDialogState: defaultReportDialogState,

      openBoardInfo: false,
      openDeleteBoard: false,
      openPublishBoard: false,
      openCopyBoard: false,
      openImageBoard: false,
      openEditBoardTitle: false,
      imageBoard: null,
      isSymbolSearchOpen: false,
      editBoardTitleDialogValue: props.board.name,
      editBoardDescriptionDialogValue: props.board.description
        ? props.board.description
        : ''
    };
  }

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ menu: null });
  }

  handleBoardInfoOpen() {
    this.setState({
      openBoardInfo: true
    });
  }

  handleBoardDeleteOpen() {
    this.setState({
      openDeleteBoard: true
    });
  }

  handleBoardReportOpen() {
    this.setState({
      reportDialogState: {
        ...this.state.reportDialogState,
        openBoardReport: true
      }
    });
  }

  handleBoardDescriptionChange = event => {
    const { value: editBoardDescriptionDialogValue } = event.target;
    this.setState({
      editBoardDescriptionDialogValue: editBoardDescriptionDialogValue
    });
  };

  handleBoardTitleChange = event => {
    const { value: editBoardTitleDialogValue } = event.target;
    this.setState({ editBoardTitleDialogValue: editBoardTitleDialogValue });
  };

  handleBoardImageChange(image) {
    this.setState({ imageBoard: image });
  }

  async handleBoardPublishOpen(board) {
    if (!board.isPublic && !board.description) {
      this.setState({
        openPublishBoard: true
      });
    } else {
      this.setState({ loading: true });
      try {
        if (this.state.editBoardDescriptionDialogValue) {
          board.description = this.state.editBoardDescriptionDialogValue;
        }
        await this.props.publishBoard(board);
      } catch (err) {
      } finally {
        this.setState({
          loading: false
        });
      }
    }
  }

  handleBoardCopyOpen() {
    this.setState({
      openCopyBoard: true
    });
  }

  async handleBoardCopy(board) {
    this.setState({
      openCopyBoard: false,
      loading: true
    });
    try {
      await this.props.copyBoard(board);
    } catch (err) {
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  async handleBoardDelete(board) {
    this.setState({
      openDeleteBoard: false,
      loading: true
    });
    try {
      await this.props.deleteMyBoard(board);
    } catch (err) {
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  handleBoardReport = async boardUrl => {
    const {
      boardReport,
      board: { id, name, author, description },
      userData: { name: whistleblowerName, email: whistleblowerEmail }
    } = this.props;
    const { reportDialogState } = this.state;

    const reportedBoardData = {
      id,
      name,
      author,
      description,
      url: boardUrl,
      reason: reportDialogState.reportReason
    };

    const whistleblower = {
      name: whistleblowerName,
      email: whistleblowerEmail
    };

    const reportData = {
      ...reportedBoardData,
      whistleblower
    };

    this.setState({
      reportDialogState: { ...reportDialogState, loading: true }
    });
    try {
      await boardReport(reportData);
      this.setState({
        reportDialogState: {
          ...reportDialogState,
          error: false,
          success: true,
          loading: false
        }
      });
    } catch (error) {
      this.setState({
        reportDialogState: {
          ...reportDialogState,
          error: true,
          loading: false
        }
      });
    }
  };

  handleSymbolSearchClick = event => {
    this.setState({ isSymbolSearchOpen: true });
  };

  handleSymbolSearchChange = ({ image }) => {
    this.setState({ imageBoard: image });
  };

  handleSymbolSearchClose = event => {
    this.setState({ isSymbolSearchOpen: false });
  };

  async handleBoardImage(board) {
    this.setState({
      openImageBoard: false,
      loading: true
    });

    try {
      if (this.state.imageBoard) {
        const newBoard = {
          ...board,
          caption: this.state.imageBoard
        };
        await this.props.updateMyBoard(newBoard);
      }
    } catch (err) {
    } finally {
      this.setState({
        imageBoard: null,
        loading: false
      });
    }
  }

  async handleBoardTitleDesc(board) {
    this.setState({
      openEditBoardTitle: false,
      loading: true
    });
    try {
      const newBoard = {
        ...board,
        description: this.state.editBoardDescriptionDialogValue
          ? this.state.editBoardDescriptionDialogValue
          : board.description,
        name: this.state.editBoardTitleDialogValue
          ? this.state.editBoardTitleDialogValue
          : board.name
      };
      await this.props.updateMyBoard(newBoard);
    } catch (err) {
      console.log(err.message);
    } finally {
      this.setState({
        editBoardDescriptionDialogValue: board.description,
        editBoardTitleDialogValue: board.name,
        loading: false
      });
    }
  }

  async handleBoardPublish(board) {
    this.setState({
      openPublishBoard: false,
      loading: true
    });

    try {
      if (this.state.editBoardDescriptionDialogValue) {
        const newBoard = {
          ...board,
          description: this.state.editBoardDescriptionDialogValue
        };
        await this.props.updateMyBoard(newBoard);
        await this.props.publishBoard(newBoard);
      } else {
        await this.props.publishBoard(board);
      }
    } catch (err) {
    } finally {
      this.setState({
        editBoardDescriptionDialogValue: '',
        loading: false
      });
    }
  }

  handleDialogClose() {
    this.setState({
      reportDialogState: defaultReportDialogState,
      openBoardInfo: false,
      openCopyBoard: false,
      openDeleteBoard: false,
      openPublishBoard: false,
      openEditBoardTitle: false,
      openImageBoard: false
    });
  }

  async setRootBoard(board) {
    await this.props.setRootBoard(board);
  }

  render() {
    const {
      board,
      selectedTab,
      intl,
      userData,
      communicator,
      activeBoardId,
      addOrRemoveBoard
    } = this.props;
    const { reportDialogState } = this.state;
    const title = board.name || board.id;
    const boardUrl =
      window.location.origin +
      '/' +
      window.location.pathname.split('/')[1] +
      '/' +
      board.id;
    const displayActions =
      selectedTab === TAB_INDEXES.MY_BOARDS ||
      selectedTab === TAB_INDEXES.PUBLIC_BOARDS ||
      (selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS && !!userData.authToken);
    // Cordova path cannot be absolute
    const boardCaption =
      isCordova() && board.caption && board.caption.search('/') === 0
        ? `.${board.caption}`
        : board.caption;
    const imageBoard =
      isCordova() &&
      this.state.imageBoard &&
      this.state.imageBoard.search('/') === 0
        ? `.${this.state.imageBoard}`
        : this.state.imageBoard;

    const ReportBoardDialog = () => {
      const ReportSuccesContent = (
        <>
          <DialogContent>
            <div className="CommunicatorDialog__board-report-success">
              <CheckCircleIcon
                className="CommunicatorDialog__board-report-success-icon"
                color="primary"
              />
              <DialogContentText>
                {intl.formatMessage(messages.boardReportSuccesSubtitle)}
                <br />
                {intl.formatMessage(messages.boardReportSuccesGratitude)}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleDialogClose.bind(this)}
              variant="contained"
              color="primary"
            >
              {intl.formatMessage(messages.boardReportClose)}
            </Button>
          </DialogActions>
        </>
      );

      const ReportingContent = (
        <>
          <DialogContent>
            <DialogContentText>
              {intl.formatMessage(messages.boardReportContentSubtitle)}
              <br />
              <br />
              {intl.formatMessage(messages.boardInfoName)}
              <br />
              <b>{board.name}</b>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="report-reason"
              label="Report reason"
              multiline={true}
              minRows={1}
              required={true}
              type="text"
              fullWidth
              onChange={event =>
                this.setState({
                  reportDialogState: {
                    ...reportDialogState,
                    reportReason: event.target.value
                  }
                })
              }
            />
            {reportDialogState.error && (
              <div
                style={{
                  color: '#f44336'
                }}
              >
                <Typography color="inherit">
                  {intl.formatMessage(messages.boardReportError)}
                </Typography>
              </div>
            )}

            {reportDialogState.loading && (
              <LinearProgress style={{ margin: '1em' }} />
            )}
          </DialogContent>

          {!reportDialogState.loading && (
            <DialogActions>
              <Button
                onClick={this.handleDialogClose.bind(this)}
                variant="contained"
                color="default"
              >
                {intl.formatMessage(messages.boardReportCancel)}
              </Button>

              <Button
                onClick={() => this.handleBoardReport(boardUrl)}
                variant="contained"
                color="primary"
                disabled={!reportDialogState.reportReason}
              >
                {intl.formatMessage(messages.boardReportSend)}
              </Button>
            </DialogActions>
          )}
        </>
      );
      return (
        <>
          <Dialog
            open={reportDialogState.openBoardReport}
            onClose={this.handleDialogClose.bind(this)}
            aria-labelledby="board-reoport-title"
          >
            {reportDialogState.openBoardReport && (
              <>
                <DialogTitle id="form-dialog-title">
                  <div className="CommunicatorDialog__board-report-dialog-title">
                    {intl.formatMessage(messages.boardReport)}
                    <FlagIcon fontSize="large" />
                  </div>
                </DialogTitle>
                <div className="CommunicatorDialog__board-report-dialog">
                  {reportDialogState.success
                    ? ReportSuccesContent
                    : ReportingContent}
                </div>
              </>
            )}
          </Dialog>
        </>
      );
    };

    return (
      <div className="CommunicatorDialog__boards__item">
        <div className="CommunicatorDialog__boards__item__image">
          {!!boardCaption && (
            <div className="CommunicatorDialog__boards__item__image_container">
              <img src={boardCaption} alt={title} />
              {selectedTab === TAB_INDEXES.MY_BOARDS && (
                <Button
                  variant="contained"
                  disableElevation={true}
                  onClick={() => {
                    this.setState({ openImageBoard: true });
                  }}
                  id="CommunicatorDialog__boards__item__image__Btn"
                >
                  <EditIcon />
                </Button>
              )}
            </div>
          )}
          {!boardCaption && (
            <div className="CommunicatorDialog__boards__item__image__empty">
              <ViewModuleIcon className="CommunicatorDialog__boards__item__image__empty ViewModuleIcon" />
              {selectedTab === TAB_INDEXES.MY_BOARDS && (
                <Button
                  variant="contained"
                  disableElevation={true}
                  onClick={() => {
                    this.setState({ openImageBoard: true });
                  }}
                >
                  <EditIcon />
                </Button>
              )}
            </div>
          )}
          <Dialog
            onClose={this.handleDialogClose.bind(this)}
            aria-labelledby="board-image-dialog"
            open={this.state.openImageBoard}
            TransitionComponent={Transition}
            aria-describedby="board-image-desc"
          >
            <DialogTitle
              id="board-image-title"
              onClose={this.handleDialogClose.bind(this)}
            >
              {intl.formatMessage(messages.imageBoard)}
            </DialogTitle>
            <DialogContent className="CommunicatorDialog__imageDialog__content">
              <DialogContentText id="dialog-image-board-desc">
                {intl.formatMessage(messages.imageBoardDescription)}
              </DialogContentText>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={this.handleSymbolSearchClick}
              >
                {intl.formatMessage(messages.imageSearch)}
              </Button>
              <InputImage onChange={this.handleBoardImageChange.bind(this)} />
              {!!this.state.imageBoard && (
                <img src={imageBoard} alt={board.name} />
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleDialogClose.bind(this)}
                color="primary"
              >
                {intl.formatMessage(messages.close)}
              </Button>
              <Button
                onClick={() => {
                  this.handleBoardImage(board);
                }}
                color="primary"
              >
                {intl.formatMessage(messages.accept)}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div className="CommunicatorDialog__boards__item__data">
          <div className="CommunicatorDialog__boards__item__data__title">
            <ListItem disableGutters={true}>
              <ListItemText
                primary={
                  <div>
                    {title}
                    {selectedTab === TAB_INDEXES.MY_BOARDS && (
                      <div className="CommunicatorDialog__boards__item__edit-title">
                        <IconButton
                          aria-label="edit-title"
                          onClick={() => {
                            this.setState({ openEditBoardTitle: true });
                          }}
                          label={intl.formatMessage(messages.editBoardTitle)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </div>
                    )}
                  </div>
                }
                secondary={intl.formatMessage(messages.tilesQty, {
                  qty: board.tiles.length
                })}
              />
            </ListItem>
          </div>
          <Dialog
            onClose={this.handleDialogClose.bind(this)}
            aria-labelledby="board-edit-title-dialog"
            open={this.state.openEditBoardTitle}
            TransitionComponent={Transition}
            aria-describedby="board-edit-title-desc"
          >
            <DialogTitle
              id="board-edit-title-title"
              onClose={this.handleDialogClose.bind(this)}
            >
              {intl.formatMessage(messages.editBoardTitle)}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="dialog-board-edit-title-desc">
                {intl.formatMessage(messages.editBoardTitleDescription)}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label={intl.formatMessage(messages.boardInfoName)}
                type="text"
                fullWidth
                value={this.state.editBoardTitleDialogValue}
                onChange={this.handleBoardTitleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label={intl.formatMessage(messages.publishBoard)}
                type="text"
                multiline
                rowsMax={6}
                fullWidth
                value={this.state.editBoardDescriptionDialogValue}
                onChange={this.handleBoardDescriptionChange}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleDialogClose.bind(this)}
                color="primary"
              >
                {intl.formatMessage(messages.close)}
              </Button>
              <Button
                onClick={() => {
                  this.handleBoardTitleDesc(board);
                }}
                variant="contained"
                color="primary"
              >
                {intl.formatMessage(messages.accept)}
              </Button>
            </DialogActions>
          </Dialog>
          <div className="CommunicatorDialog__boards__item__data__author">
            {intl.formatMessage(messages.author, { author: board.author })}
          </div>
          <div className="CommunicatorDialog__boards__item__data__date">
            {moment(board.lastEdited).format('DD/MM/YYYY')}
          </div>
          <div className="CommunicatorDialog__boards__item__data__extra">
            {board.isPublic && (
              <Tooltip
                title={intl.formatMessage(messages.publicBoard)}
                name="CommunicatorDialog__PropertyOption"
              >
                <PublicIcon />
              </Tooltip>
            )}
            {!board.isPublic && (
              <Tooltip
                title={intl.formatMessage(messages.privateBoard)}
                name="CommunicatorDialog__PropertyOption"
              >
                <KeyIcon />
              </Tooltip>
            )}
            {communicator.rootBoard === board.id && (
              <Tooltip
                title={intl.formatMessage(messages.rootBoard)}
                name="CommunicatorDialog__PropertyOption"
              >
                <HomeIcon />
              </Tooltip>
            )}
            {activeBoardId === board.id && (
              <Tooltip
                title={intl.formatMessage(messages.activeBoard)}
                name="CommunicatorDialog__PropertyOption"
              >
                <RemoveRedEyeIcon />
              </Tooltip>
            )}
          </div>
        </div>
        <div>
          {this.state.loading && <CircularProgress size={25} thickness={7} />}
        </div>
        <div className="CommunicatorDialog__boards__item__actions">
          {displayActions && (
            <div>
              {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS && (
                <div>
                  <IconButton
                    disabled={
                      communicator.rootBoard === board.id || !userData.authToken
                    }
                    label={intl.formatMessage(messages.removeBoard)}
                    onClick={() => {
                      addOrRemoveBoard(board);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    disabled={communicator.rootBoard === board.id}
                    onClick={() => {
                      this.setRootBoard(board);
                    }}
                    label={intl.formatMessage(messages.menuRootBoardOption)}
                  >
                    <HomeIcon />
                  </IconButton>
                </div>
              )}
              {selectedTab === TAB_INDEXES.PUBLIC_BOARDS && (
                <div>
                  <IconButton
                    disabled={
                      communicator.boards.includes(board.id) ||
                      (userData && userData.email === board.email)
                    }
                    onClick={this.handleBoardCopyOpen.bind(this)}
                    label={intl.formatMessage(messages.copyBoard)}
                  >
                    <QueueIcon />
                  </IconButton>
                  <IconButton
                    label={intl.formatMessage(messages.boardInfo)}
                    onClick={this.handleBoardInfoOpen.bind(this)}
                  >
                    <InfoIcon />
                  </IconButton>
                  <IconButton
                    label={intl.formatMessage(messages.boardReport)}
                    onClick={this.handleBoardReportOpen.bind(this)}
                  >
                    <FlagIcon />
                  </IconButton>
                  {ReportBoardDialog()}
                  <Dialog
                    onClose={this.handleDialogClose.bind(this)}
                    aria-labelledby="board-info-title"
                    open={this.state.openBoardInfo}
                    className="CommunicatorDialog__boardInfoDialog"
                  >
                    <DialogTitle
                      id="board-info-title"
                      onClose={this.handleDialogClose.bind(this)}
                    >
                      {board.name}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        <Typography variant="body1" gutterBottom>
                          <b>{intl.formatMessage(messages.boardInfoName)}:</b>{' '}
                          {board.name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>{intl.formatMessage(messages.boardInfoAuthor)}:</b>{' '}
                          {board.author}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>
                            {intl.formatMessage(messages.boardDescription)}:
                          </b>{' '}
                          {board.description}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>{intl.formatMessage(messages.boardInfoDate)}:</b>{' '}
                          {moment(board.lastEdited).format('DD/MM/YYYY')}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>{intl.formatMessage(messages.boardInfoTiles)}:</b>{' '}
                          {board.tiles.length}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <b>{intl.formatMessage(messages.boardInfoId)}:</b>{' '}
                          {board.id}
                        </Typography>
                        {!isCordova() && (
                          <Typography variant="body1" gutterBottom>
                            <b>{intl.formatMessage(messages.boardInfoUrl)}:</b>{' '}
                            <a
                              href={boardUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {boardUrl}
                            </a>
                          </Typography>
                        )}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={this.handleDialogClose.bind(this)}
                        color="primary"
                      >
                        {intl.formatMessage(messages.close)}
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    onClose={this.handleDialogClose.bind(this)}
                    aria-labelledby="board-copy-dialog"
                    open={this.state.openCopyBoard}
                  >
                    <DialogTitle
                      id="board-copy-title"
                      onClose={this.handleDialogClose.bind(this)}
                    >
                      {intl.formatMessage(messages.copyBoard)}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {intl.formatMessage(messages.copyBoardDescription)}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={this.handleDialogClose.bind(this)}
                        color="primary"
                      >
                        {intl.formatMessage(messages.close)}
                      </Button>
                      <Button
                        onClick={() => {
                          this.handleBoardCopy(board);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        {intl.formatMessage(messages.accept)}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              )}
              {selectedTab === TAB_INDEXES.MY_BOARDS && (
                <div>
                  <IconButton
                    disabled={communicator.rootBoard === board.id}
                    label={
                      communicator.boards.includes(board.id)
                        ? intl.formatMessage(messages.removeBoard)
                        : intl.formatMessage(messages.addBoard)
                    }
                    onClick={() => {
                      addOrRemoveBoard(board);
                    }}
                  >
                    {communicator.boards.includes(board.id) ? (
                      <ClearIcon />
                    ) : (
                      <InputIcon />
                    )}
                  </IconButton>
                  <IconButton
                    label={
                      board.isPublic
                        ? intl.formatMessage(messages.menuUnpublishOption)
                        : intl.formatMessage(messages.menuPublishOption)
                    }
                    onClick={() => {
                      this.handleBoardPublishOpen(board);
                    }}
                  >
                    {board.isPublic ? <KeyIcon /> : <PublicIcon />}
                  </IconButton>
                  <Dialog
                    onClose={this.handleDialogClose.bind(this)}
                    aria-labelledby="board-publish-dialog"
                    open={this.state.openPublishBoard}
                    TransitionComponent={Transition}
                    aria-describedby="board-publish-desc"
                  >
                    <DialogTitle
                      id="board-publish-title"
                      onClose={this.handleDialogClose.bind(this)}
                    >
                      {intl.formatMessage(messages.publishBoard)}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="dialog-publish-board-desc">
                        {intl.formatMessage(messages.publishBoardDescription)}
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label={intl.formatMessage(messages.publishBoard)}
                        type="text"
                        fullWidth
                        value={this.state.editBoardDescriptionDialogValue}
                        onChange={this.handleBoardDescriptionChange}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={this.handleDialogClose.bind(this)}
                        color="primary"
                      >
                        {intl.formatMessage(messages.close)}
                      </Button>
                      <Button
                        onClick={() => {
                          this.handleBoardPublish(board);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        {intl.formatMessage(messages.accept)}
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <IconButton
                    disabled={
                      communicator.rootBoard === board.id ||
                      activeBoardId === board.id
                    }
                    label={intl.formatMessage(messages.deleteBoard)}
                    onClick={() => {
                      this.handleBoardDeleteOpen(board);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Dialog
                    onClose={this.handleDialogClose.bind(this)}
                    aria-labelledby="board-delete-dialog"
                    open={this.state.openDeleteBoard}
                  >
                    <DialogTitle
                      id="board-delete-title"
                      onClose={this.handleDialogClose.bind(this)}
                    >
                      {intl.formatMessage(messages.deleteBoard)}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {intl.formatMessage(messages.deleteBoardDescription)}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={this.handleDialogClose.bind(this)}
                        color="primary"
                      >
                        {intl.formatMessage(messages.close)}
                      </Button>
                      <Button
                        onClick={() => {
                          this.handleBoardDelete(board);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        {intl.formatMessage(messages.accept)}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </div>

        <SymbolSearch
          open={this.state.isSymbolSearchOpen}
          onChange={this.handleSymbolSearchChange}
          onClose={this.handleSymbolSearchClose}
        />
      </div>
    );
  }
}

CommunicatorDialogBoardItem.propTypes = {
  intl: intlShape,
  communicator: PropTypes.object,
  activeBoardId: PropTypes.string,
  selectedTab: PropTypes.number,
  board: PropTypes.object,
  userData: PropTypes.object,
  copyBoard: PropTypes.func.isRequired,
  addOrRemoveBoard: PropTypes.func.isRequired,
  deleteMyBoard: PropTypes.func.isRequired,
  updateMyBoard: PropTypes.func.isRequired,
  publishBoard: PropTypes.func.isRequired,
  boardReport: PropTypes.func.isRequired,
  setRootBoard: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string)
};

export default CommunicatorDialogBoardItem;
