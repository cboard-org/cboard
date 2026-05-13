import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import shortid from 'shortid';

import { Scanner } from 'react-scannable';
import BoardGrid from '../Board/BoardGrid/BoardGrid.component';
import OutputContainer from '../Board/Output';
import { Scannable } from 'react-scannable';
import { processTileClick, computeScrollState } from '../Board/Board.utils';
import { resolveTileLabel } from '../../helpers';
import {
  speak,
  cancelSpeech
} from '../../providers/SpeechProvider/SpeechProvider.actions';
import { changeOutput } from '../Board/Board.actions';
import { isLogged as isLoggedSelector } from '../App/App.selectors';
import { getAccessBoard } from '../../api/accessApi';
import AccessViewerNavbar from './AccessViewerNavbar';
import AccessViewerHeader from './AccessViewerHeader';
import AccessViewerError from './AccessViewerError';
import './AccessViewer.css';

const noop = () => {};

const AccessViewer = ({
  speak,
  cancelSpeech,
  changeOutput,
  output,
  isLogged,
  intl,
  displaySettings,
  navigationSettings,
  scannerSettings
}) => {
  const { slug, code } = useParams();
  const history = useHistory();
  const boardContainerRef = useRef(null);
  const fixedBoardContainerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);

  // allBoards: boards indexed by id for O(1) navigation lookup
  const [allBoards, setAllBoards] = useState({});
  // boardHistory: navigation stack; last entry is the current board
  const [boardHistory, setBoardHistory] = useState([]);

  const [isLocked, setIsLocked] = useState(true);

  const [isScroll, setIsScrollState] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const setIsScroll = useCallback((scroll, rows = 0) => {
    setIsScrollState(scroll);
    setTotalRows(rows);
  }, []);

  const handleLayoutChange = useCallback(
    currentLayout => {
      if (!navigationSettings.bigScrollButtonsActive) return;
      const cols =
        currentLayout.reduce((max, item) => (item.x > max ? item.x : max), 0) +
        1;
      const { isScroll, totalRows } = computeScrollState(
        currentLayout.length,
        cols,
        3
      );
      setIsScroll(isScroll, totalRows);
    },
    [navigationSettings.bigScrollButtonsActive, setIsScroll]
  );

  const currentBoard =
    boardHistory.length > 0 ? boardHistory[boardHistory.length - 1] : null;

  // Load all boards in a single request on mount; clear output on enter and leave
  useEffect(
    () => {
      changeOutput([]);

      const loadAllBoards = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await getAccessBoard(slug, code);

          if (!response.boards || response.boards.length === 0) {
            setError('error');
            setLoading(false);
            return;
          }

          // Index boards by id for instant lookup
          const boardsMap = {};
          response.boards.forEach(board => {
            boardsMap[board.id] = board;
          });

          const rootBoard = boardsMap[response.rootBoardId];
          if (!rootBoard) {
            setError('error');
            setLoading(false);
            return;
          }

          setClient(response.client);
          setAllBoards(boardsMap);
          setBoardHistory([rootBoard]);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          if (err.response?.status === 404) {
            setError('invalid');
          } else if (err.response?.status === 403) {
            setError('forbidden');
          } else {
            setError('error');
          }
        }
      };

      loadAllBoards();

      return () => {
        cancelSpeech();
        changeOutput([]);
      };
    },
    [slug, code, cancelSpeech, changeOutput]
  );

  const handleTileClick = useCallback(
    clickedTile => {
      const tile = {
        ...clickedTile,
        label: resolveTileLabel(clickedTile, intl)
      };

      processTileClick({
        tile,
        boards: Object.values(allBoards),
        output,
        navigationSettings,
        speak,
        changeBoard: null,
        changeOutput,
        isLiveMode: currentBoard ? currentBoard.isLiveMode : false,
        generateId: shortid.generate,
        onNavigate: nextBoardId => {
          setBoardHistory(prev => [...prev, allBoards[nextBoardId]]);
        },
        onBoardNotFound: () => {}
      });
    },
    [
      intl,
      allBoards,
      speak,
      output,
      changeOutput,
      navigationSettings,
      currentBoard
    ]
  );

  const handleRequestPreviousBoard = useCallback(
    () => {
      if (boardHistory.length > 1) {
        setBoardHistory(prev => prev.slice(0, -1));
      }
    },
    [boardHistory.length]
  );

  const handleRequestToRootBoard = useCallback(
    () => {
      if (boardHistory.length > 1) {
        setBoardHistory(prev => [prev[0]]);
      }
    },
    [boardHistory.length]
  );

  const handleLockClick = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

  const handleCloseClick = useCallback(
    () => {
      cancelSpeech();
      history.push(isLogged ? '/' : '/login-signup');
    },
    [isLogged, history, cancelSpeech]
  );

  if (loading) {
    return (
      <div className="AccessViewer__loading">
        <CircularProgress size={60} thickness={5} />
        <p>Loading board...</p>
      </div>
    );
  }

  if (error) {
    return <AccessViewerError type={error} />;
  }

  if (!currentBoard) {
    return <AccessViewerError type="error" />;
  }

  const disableBackButton = boardHistory.length <= 1;

  return (
    <Scanner
      active={scannerSettings.active}
      iterationInterval={scannerSettings.delay}
      strategy={scannerSettings.strategy}
    >
      <div className="AccessViewer">
        {client && (
          <AccessViewerHeader
            clientName={client.name}
            brandColor={client.color}
          />
        )}

        <Scannable>
          <div
            className={classNames('AccessViewer__output', {
              hidden: displaySettings.hideOutputActive
            })}
          >
            <OutputContainer />
          </div>
        </Scannable>

        <AccessViewerNavbar
          title={currentBoard.name || ''}
          isLocked={isLocked}
          disableBackButton={disableBackButton}
          onBackClick={handleRequestPreviousBoard}
          onHomeClick={handleRequestToRootBoard}
          onLockClick={handleLockClick}
          onCloseClick={handleCloseClick}
        />

        <div className="AccessViewer__board">
          <BoardGrid
            board={currentBoard}
            displaySettings={displaySettings}
            navigationSettings={navigationSettings}
            scannerSettings={scannerSettings}
            isSelecting={false}
            isSaving={false}
            isFixedBoard={currentBoard.isFixed}
            selectedTileIds={[]}
            intl={intl}
            onTileClick={handleTileClick}
            onFocusTile={noop}
            onRequestPreviousBoard={handleRequestPreviousBoard}
            onRequestToRootBoard={handleRequestToRootBoard}
            boardContainerRef={boardContainerRef}
            fixedBoardContainerRef={fixedBoardContainerRef}
            setIsScroll={setIsScroll}
            isScroll={isScroll}
            totalRows={totalRows}
            navHistory={boardHistory.map(b => b.id)}
            onLayoutChange={handleLayoutChange}
          />
        </div>
      </div>
    </Scanner>
  );
};

AccessViewer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = state => ({
  isLogged: isLoggedSelector(state),
  output: state.board.output,
  displaySettings: state.app.displaySettings,
  navigationSettings: state.app.navigationSettings,
  scannerSettings: state.scanner
});

const mapDispatchToProps = {
  speak,
  cancelSpeech,
  changeOutput
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AccessViewer));
