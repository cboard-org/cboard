import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

/**
 * Selection state for the board list.
 *
 * The details panel / bottom sheet renders whatever is selected here. Focus
 * management lives with the selection because Escape has to return focus to
 * the exact card the user came from, which means something has to remember
 * that card's DOM node.
 */
const useBoardSelection = ({ boards, section, search, page }) => {
  const [selectedId, setSelectedId] = useState(null);
  const triggers = useRef({});

  // Any change of context invalidates the selection: the panel would
  // otherwise keep describing a board that is no longer on screen.
  useEffect(
    () => {
      setSelectedId(null);
    },
    [section, search, page]
  );

  const selectedBoard = useMemo(
    () => boards.find(board => board.id === selectedId) || null,
    [boards, selectedId]
  );

  // The board was deleted, filtered out, or paged away.
  useEffect(
    () => {
      if (selectedId && !selectedBoard) {
        setSelectedId(null);
      }
    },
    [selectedId, selectedBoard]
  );

  const select = useCallback(boardId => setSelectedId(boardId), []);

  const registerTrigger = useCallback((boardId, node) => {
    if (node) {
      triggers.current[boardId] = node;
    } else {
      delete triggers.current[boardId];
    }
  }, []);

  const clear = useCallback(
    () => {
      const trigger = triggers.current[selectedId];
      setSelectedId(null);
      if (trigger && typeof trigger.focus === 'function') {
        trigger.focus();
      }
    },
    [selectedId]
  );

  return { selectedId, selectedBoard, select, clear, registerTrigger };
};

export default useBoardSelection;
