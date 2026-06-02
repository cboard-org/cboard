import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';

import FullScreenDialog from '../../UI/FullScreenDialog';
import {
  SECTIONS,
  VIEW_MODES,
  VIEW_MODE_STORAGE_KEY,
  SECTION_TO_TAB
} from './CommunicatorDialog.constants';
import messages from './CommunicatorDialog.messages';

import useBoardsFetcher from './hooks/useBoardsFetcher';
import useBoardActions from './hooks/useBoardActions';
import DashboardToolbar from './components/DashboardToolbar';
import DashboardNav, { NAV_WIDTH } from './components/DashboardNav';
import SectionHeader from './components/SectionHeader';
import BoardsView from './components/BoardsView';
import CommunicatorDialogTour from './CommunicatorDialogTour.component';

import BoardInfoDialog from './dialogs/BoardInfoDialog';
import ConfirmDialog from './dialogs/ConfirmDialog';
import EditBoardDialog from './dialogs/EditBoardDialog';
import PublishBoardDialog from './dialogs/PublishBoardDialog';
import ReportBoardDialog from './dialogs/ReportBoardDialog';

const useStyles = makeStyles(theme => ({
  dashboard: {
    display: 'flex',
    minHeight: '100%'
  },
  nav: {
    width: NAV_WIDTH,
    flexShrink: 0,
    [theme.breakpoints.down('xs')]: {
      width: 0
    }
  },
  content: {
    flex: 1,
    minWidth: 0,
    padding: theme.spacing(0, 2, 2)
  }
}));

const readStoredViewMode = () => {
  const stored =
    typeof window !== 'undefined' &&
    window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
  return stored === VIEW_MODES.LIST ? VIEW_MODES.LIST : VIEW_MODES.GRID;
};

const CommunicatorDialog = ({
  open,
  intl,
  onClose,
  // redux state
  userData,
  language,
  communicators,
  currentCommunicator,
  communicatorBoards,
  availableBoards,
  activeBoardId,
  communicatorTour,
  isSymbolSearchTourEnabled,
  // dispatchers
  createBoard,
  updateBoard,
  replaceBoard,
  addBoards,
  deleteBoard,
  deleteApiBoard,
  updateApiBoard,
  updateApiObjectsNoChild,
  addBoardCommunicator,
  verifyAndUpsertCommunicator,
  upsertApiCommunicator,
  showNotification,
  disableTour
}) => {
  const classes = useStyles();

  const [section, setSection] = useState(SECTIONS.MY_COMMUNICATOR);
  const [viewMode, setViewMode] = useState(readStoredViewMode);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [busyBoardId, setBusyBoardId] = useState(null);
  const [dialog, setDialog] = useState({ type: null, board: null });

  const fetcher = useBoardsFetcher({
    section,
    search,
    communicatorBoards,
    availableBoards,
    userData
  });

  const actions = useBoardActions({
    section,
    intl,
    userData,
    language,
    communicators,
    currentCommunicator,
    communicatorBoards,
    availableBoards,
    createBoard,
    updateBoard,
    replaceBoard,
    addBoards,
    deleteBoard,
    deleteApiBoard,
    updateApiBoard,
    updateApiObjectsNoChild,
    addBoardCommunicator,
    verifyAndUpsertCommunicator,
    upsertApiCommunicator,
    showNotification,
    refetch: fetcher.refetch,
    removeBoardFromList: fetcher.removeBoardFromList,
    replaceBoardInList: fetcher.replaceBoardInList
  });

  const debouncedSetSearch = useMemo(
    () => debounce(value => setSearch(value), 400),
    []
  );

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleSearchChange = value => {
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  const handleSectionChange = nextSection => {
    setSection(nextSection);
    setSearchInput('');
    setSearch('');
  };

  const handleViewModeChange = mode => {
    setViewMode(mode);
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  };

  const closeDialog = () => setDialog({ type: null, board: null });

  const runBusy = async (board, fn) => {
    setBusyBoardId(board.id);
    try {
      await fn(board);
    } finally {
      setBusyBoardId(null);
    }
  };

  const handlers = {
    onSetRoot: board => runBusy(board, actions.setRootBoard),
    onAddRemove: board => runBusy(board, actions.addOrRemoveBoard),
    onShowInfo: board => setDialog({ type: 'info', board }),
    onReport: board => setDialog({ type: 'report', board }),
    onEdit: board => setDialog({ type: 'edit', board }),
    onDelete: board => setDialog({ type: 'delete', board }),
    onCopy: board => setDialog({ type: 'copy', board }),
    onPublishToggle: board => {
      if (!board.isPublic && !board.description) {
        setDialog({ type: 'publish', board });
      } else {
        runBusy(board, actions.publishBoard);
      }
    }
  };

  const boardProps = {
    intl,
    section,
    communicator: currentCommunicator,
    userData,
    activeBoardId,
    handlers
  };

  return (
    <FullScreenDialog
      fullWidth
      open={open}
      title={intl.formatMessage(messages.title)}
      onClose={onClose}
      buttons={
        <DashboardToolbar
          intl={intl}
          search={searchInput}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onOpenNav={() => setMobileNavOpen(true)}
        />
      }
    >
      <div className={classes.dashboard}>
        <DashboardNav
          intl={intl}
          section={section}
          onChange={handleSectionChange}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />

        <main className={classes.content}>
          <SectionHeader intl={intl} section={section} total={fetcher.total} />

          <BoardsView
            intl={intl}
            boards={fetcher.boards}
            viewMode={viewMode}
            loading={fetcher.loading}
            error={fetcher.error}
            hasSearch={!!search}
            page={fetcher.page}
            totalPages={fetcher.totalPages}
            onPageChange={fetcher.goToPage}
            onRetry={fetcher.refetch}
            busyBoardId={busyBoardId}
            boardProps={boardProps}
          />

          <CommunicatorDialogTour
            communicatorTour={communicatorTour}
            selectedTab={SECTION_TO_TAB[section]}
            disableTour={disableTour}
            intl={intl}
          />
        </main>
      </div>

      <BoardInfoDialog
        intl={intl}
        open={dialog.type === 'info'}
        board={dialog.board}
        onClose={closeDialog}
      />
      <ConfirmDialog
        intl={intl}
        open={dialog.type === 'delete'}
        title={intl.formatMessage(messages.deleteBoard)}
        description={intl.formatMessage(messages.deleteBoardDescription)}
        onConfirm={() => actions.deleteMyBoard(dialog.board)}
        onClose={closeDialog}
      />
      <ConfirmDialog
        intl={intl}
        open={dialog.type === 'copy'}
        premium
        title={intl.formatMessage(messages.copyBoard)}
        description={intl.formatMessage(messages.copyBoardDescription)}
        onConfirm={() => actions.copyBoard(dialog.board)}
        onClose={closeDialog}
      />
      <PublishBoardDialog
        intl={intl}
        open={dialog.type === 'publish'}
        board={dialog.board}
        onUpdateBoard={actions.updateMyBoard}
        onPublish={actions.publishBoard}
        onClose={closeDialog}
      />
      <EditBoardDialog
        intl={intl}
        open={dialog.type === 'edit'}
        board={dialog.board}
        onUpdateBoard={actions.updateMyBoard}
        onClose={closeDialog}
        disableTour={disableTour}
        isSymbolSearchTourEnabled={isSymbolSearchTourEnabled}
      />
      <ReportBoardDialog
        intl={intl}
        open={dialog.type === 'report'}
        board={dialog.board}
        userData={userData}
        onReport={actions.boardReport}
        onClose={closeDialog}
      />
    </FullScreenDialog>
  );
};

CommunicatorDialog.defaultProps = {
  open: false,
  onClose: () => {}
};

CommunicatorDialog.propTypes = {
  open: PropTypes.bool,
  intl: intlShape.isRequired,
  onClose: PropTypes.func,
  userData: PropTypes.object,
  language: PropTypes.object,
  communicators: PropTypes.array,
  currentCommunicator: PropTypes.object,
  communicatorBoards: PropTypes.array,
  availableBoards: PropTypes.array,
  activeBoardId: PropTypes.string,
  communicatorTour: PropTypes.object.isRequired,
  isSymbolSearchTourEnabled: PropTypes.bool,
  createBoard: PropTypes.func.isRequired,
  updateBoard: PropTypes.func.isRequired,
  replaceBoard: PropTypes.func.isRequired,
  addBoards: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired,
  deleteApiBoard: PropTypes.func.isRequired,
  updateApiBoard: PropTypes.func.isRequired,
  updateApiObjectsNoChild: PropTypes.func.isRequired,
  addBoardCommunicator: PropTypes.func.isRequired,
  verifyAndUpsertCommunicator: PropTypes.func.isRequired,
  upsertApiCommunicator: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  disableTour: PropTypes.func.isRequired
};

export default CommunicatorDialog;
