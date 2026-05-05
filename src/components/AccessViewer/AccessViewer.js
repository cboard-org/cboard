import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Scanner } from 'react-scannable';
import BoardGrid from '../Board/BoardGrid/BoardGrid.component';
import OutputContainer from '../Board/Output';
import { Scannable } from 'react-scannable';
import { vocalizeTile } from '../Board/Board.utils';
import { resolveTileLabel } from '../../helpers';
import {
  speak,
  cancelSpeech
} from '../../providers/SpeechProvider/SpeechProvider.actions';
import { changeOutput } from '../Board/Board.actions';
import { isLogged as isLoggedSelector } from '../App/App.selectors';
import API from '../../api';
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

          const response = await API.getAccessBoard(slug, code);

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

      if (tile.loadBoard) {
        const nextBoard = allBoards[tile.loadBoard];
        if (nextBoard) {
          setBoardHistory(prev => [...prev, nextBoard]);
          vocalizeTile(tile, speak);
        }
        return;
      }

      vocalizeTile(tile, speak);
      changeOutput([...output, tile]);
    },
    [intl, allBoards, speak, output, changeOutput]
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
          <div className="AccessViewer__output">
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
