import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Scanner } from 'react-scannable';
import Board from '../Board/Board.component';
import SymbolOutput from '../Board/Output/SymbolOutput';
import { vocalizeTile, scrollBoardToTop } from '../Board/Board.utils';
import { resolveTileLabel } from '../../helpers';
import {
  speak,
  cancelSpeech
} from '../../providers/SpeechProvider/SpeechProvider.actions';
import API from '../../api';
import AccessViewerNavbar from './AccessViewerNavbar';
import AccessViewerHeader from './AccessViewerHeader';
import AccessViewerError from './AccessViewerError';
import './AccessViewer.css';

const noop = () => {};

const AccessViewer = ({ speak, cancelSpeech, intl }) => {
  const { slug, code } = useParams();
  const boardRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);

  // allBoards: boards indexed by id for O(1) navigation lookup
  const [allBoards, setAllBoards] = useState({});
  // boardHistory: navigation stack; last entry is the current board
  const [boardHistory, setBoardHistory] = useState([]);

  const [output, setOutput] = useState([]);
  const [isLocked, setIsLocked] = useState(true);

  const currentBoard =
    boardHistory.length > 0 ? boardHistory[boardHistory.length - 1] : null;

  // Load all boards in a single request on mount
  useEffect(
    () => {
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
      };
    },
    [slug, code, cancelSpeech]
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
          scrollBoardToTop(boardRef, nextBoard.isFixed);
          vocalizeTile(tile, speak);
        }
        return;
      }

      vocalizeTile(tile, speak);
      setOutput(prev => [...prev, tile]);
    },
    [intl, allBoards, speak]
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

  const handleOutputClick = useCallback(
    event => {
      const tag = event.target.tagName.toLowerCase();
      if ((tag === 'div' || tag === 'p') && output.length) {
        const text = output
          .map(tile => tile.vocalization || tile.label)
          .join(' ');
        cancelSpeech();
        speak(text);
      }
    },
    [output, speak, cancelSpeech]
  );

  const handleOutputBackspace = useCallback(() => {
    setOutput(prev => prev.slice(0, -1));
  }, []);

  const handleOutputClear = useCallback(() => {
    setOutput([]);
  }, []);

  const handleOutputRemove = useCallback(
    index => () => {
      setOutput(prev => prev.filter((_, i) => i !== index));
    },
    []
  );

  const handleLockClick = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

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
    <div className="AccessViewer">
      {client && (
        <AccessViewerHeader
          clientName={client.name}
          brandColor={client.color}
        />
      )}

      <div className="AccessViewer__output">
        <Scanner active={false}>
          <SymbolOutput
            symbols={output}
            tabIndex={output.length ? '0' : '-1'}
            navigationSettings={{}}
            onClick={handleOutputClick}
            onBackspaceClick={handleOutputBackspace}
            onClearClick={handleOutputClear}
            onRemoveClick={handleOutputRemove}
            onWriteSymbol={() => () => {}}
            onSwitchLiveMode={noop}
            isLiveMode={false}
          />
        </Scanner>
      </div>

      <AccessViewerNavbar
        title={currentBoard.name || ''}
        isLocked={isLocked}
        disableBackButton={disableBackButton}
        onBackClick={handleRequestPreviousBoard}
        onHomeClick={handleRequestToRootBoard}
        onLockClick={handleLockClick}
      />

      <div className="AccessViewer__board">
        <Board
          ref={boardRef}
          board={currentBoard}
          intl={intl}
          navigationSettings={{}}
          viewerMode={true}
          isLocked={isLocked}
          isSelecting={false}
          isSaving={false}
          onTileClick={handleTileClick}
          onFocusTile={noop}
          onRequestPreviousBoard={handleRequestPreviousBoard}
          onRequestToRootBoard={handleRequestToRootBoard}
          onLockClick={handleLockClick}
          onLockNotify={noop}
          onAddClick={noop}
          onDeleteClick={noop}
          onEditClick={noop}
          onSelectClick={noop}
          onSelectAllToggle={noop}
        />
      </div>
    </div>
  );
};

AccessViewer.propTypes = {
  intl: intlShape.isRequired
};

const mapDispatchToProps = {
  speak,
  cancelSpeech
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(AccessViewer));
