import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import ContentToolbar from './components/ContentToolbar';
import BoardsView from './components/BoardsView';
import CommunicatorDialogTour from './CommunicatorDialogTour.component';
import useBoardSelection from './hooks/useBoardSelection';
import BoardDetailsSurface from './components/BoardDetailsSurface';
import QuickAccessTray from './components/QuickAccessTray';
import LiveRegion from './components/LiveRegion';
import { getBoardActions } from './components/boardActions';

import BoardInfoDialog from './dialogs/BoardInfoDialog';
import ConfirmDialog from './dialogs/ConfirmDialog';
import EditBoardDialog from './dialogs/EditBoardDialog';
import PublishBoardDialog from './dialogs/PublishBoardDialog';
import ReportBoardDialog from './dialogs/ReportBoardDialog';

const useStyles = makeStyles(theme => ({
  dashboard: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden'
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
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1, 2),

    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: theme.spacing(2, 2)
  },
  scrollAreaWithPanel: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 2, 2, 0)
  },
  boards: {
    flex: 1,
    minWidth: 0,
    padding: theme.spacing(2, 2, 0)
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
  disableTour,
  switchBoard
}) => {
  const classes = useStyles();

  const [section, setSection] = useState(SECTIONS.MY_COMMUNICATOR);
  const [viewMode, setViewMode] = useState(readStoredViewMode);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [busyBoardId, setBusyBoardId] = useState(null);
  const [dialog, setDialog] = useState({ type: null, board: null });
  const [announcement, setAnnouncement] = useState('');
  const announceTimer = useRef(null);

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
    replaceBoardInList: fetcher.replaceBoardInList,
    switchBoard,
    onClose
  });

  const selection = useBoardSelection({
    boards: fetcher.boards,
    section,
    search,
    page: fetcher.page
  });

  const debouncedSetSearch = useMemo(
    () => debounce(value => setSearch(value), 400),
    []
  );

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  useEffect(() => () => window.clearTimeout(announceTimer.current), []);

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

  const announce = message => {
    setAnnouncement('');
    // Re-setting the same string would not re-announce; clearing first makes
    // repeated identical results (two exports in a row) audible.
    window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(
      () => setAnnouncement(message),
      50
    );
  };

  const runBusy = async (board, fn, pendingMessage) => {
    setBusyBoardId(board.id);
    if (pendingMessage) {
      announce(pendingMessage);
    }
    try {
      await fn(board);
    } finally {
      // A slower action finishing later must not clear the spinner of a
      // different board the user has since started acting on.
      setBusyBoardId(current => (current === board.id ? null : current));
    }
  };

  const handlers = {
    onShow: board => actions.showBoard(board),
    onSetRoot: board => runBusy(board, actions.setRootBoard),
    onAddRemove: board => runBusy(board, actions.addOrRemoveBoard),
    onShowInfo: board => setDialog({ type: 'info', board }),
    onReport: board => setDialog({ type: 'report', board }),
    onEdit: board => setDialog({ type: 'edit', board }),
    onDelete: board => setDialog({ type: 'delete', board }),
    onCopy: board => setDialog({ type: 'copy', board }),
    onExport: board =>
      runBusy(
        board,
        actions.exportBoard,
        intl.formatMessage(messages.exportingBoard, { name: board.name })
      ),
    onExportPdf: board =>
      runBusy(
        board,
        actions.exportBoardToPdf,
        intl.formatMessage(messages.exportingBoard, { name: board.name })
      ),
    onPublishToggle: board => {
      if (!board.isPublic && !board.description) {
        setDialog({ type: 'publish', board });
      } else {
        runBusy(board, actions.publishBoard);
      }
    }
  };

  const selectedActions = selection.selectedBoard
    ? getBoardActions({
        section,
        board: selection.selectedBoard,
        communicator: currentCommunicator,
        userData,
        activeBoardId,
        handlers,
        intl
      })
    : [];

  const handleMove = async (boardId, delta, visibleIds) => {
    await actions.reorderCommunicatorBoards(boardId, delta, visibleIds);
    const board = communicatorBoards.find(item => item.id === boardId);
    const nextPosition = visibleIds.indexOf(boardId) + 1 + delta;
    announce(
      intl.formatMessage(messages.boardMoved, {
        name: board ? board.name : boardId,
        position: nextPosition,
        total: visibleIds.length
      })
    );
  };

  return (
    <FullScreenDialog
      fullWidth
      disableAppBarElevation
      open={open}
      title={intl.formatMessage(messages.title)}
      onClose={onClose}
      // buttons={<DashboardToolbar intl={intl} />}
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
          <div className={classes.header}>
            <SectionHeader
              intl={intl}
              section={section}
              total={fetcher.total}
              onOpenNav={() => setMobileNavOpen(true)}
            />
            {section !== SECTIONS.MY_COMMUNICATOR && (
              <ContentToolbar
                intl={intl}
                search={searchInput}
                onSearchChange={handleSearchChange}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
            )}
          </div>

          {section === SECTIONS.MY_COMMUNICATOR ? (
            <div className={classes.scrollArea}>
              <QuickAccessTray
                intl={intl}
                boards={communicatorBoards}
                communicator={currentCommunicator}
                busyBoardId={busyBoardId}
                onSetRoot={board => runBusy(board, actions.setRootBoard)}
                onRemove={board => runBusy(board, actions.addOrRemoveBoard)}
                onMove={handleMove}
                onGoToMyBoards={() => handleSectionChange(SECTIONS.MY_BOARDS)}
              />
            </div>
          ) : (
            <div className={classes.scrollAreaWithPanel}>
              <div className={classes.boards}>
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
                  communicator={currentCommunicator}
                  activeBoardId={activeBoardId}
                  selectedId={selection.selectedId}
                  onSelect={selection.select}
                  onToggleQuickAccess={board =>
                    runBusy(board, actions.addOrRemoveBoard)
                  }
                  registerTrigger={selection.registerTrigger}
                />
              </div>
              <BoardDetailsSurface
                intl={intl}
                board={selection.selectedBoard}
                actions={selectedActions}
                busy={busyBoardId === selection.selectedId}
                communicator={currentCommunicator}
                activeBoardId={activeBoardId}
                onClose={selection.clear}
              />
            </div>
          )}

          <LiveRegion message={announcement} />

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
  disableTour: PropTypes.func.isRequired,
  switchBoard: PropTypes.func.isRequired
};

export default CommunicatorDialog;
