/**
 * Ordering helpers for the Quick access tray.
 *
 * The tray renders only the communicator ids that resolve to a visible board,
 * but it persists the FULL id array. Reordering therefore swaps two ids in
 * place rather than rebuilding the array from the rendered rows — otherwise an
 * id the user cannot currently see would be silently dropped from the
 * communicator.
 */

export const swapBoardIds = (allIds, idA, idB) => {
  const a = allIds.indexOf(idA);
  const b = allIds.indexOf(idB);
  if (a < 0 || b < 0) {
    return allIds;
  }
  const next = [...allIds];
  next[a] = idB;
  next[b] = idA;
  return next;
};

/**
 * Moves `boardId` one position up (`delta === -1`) or down (`delta === 1`)
 * relative to the other VISIBLE boards. Returns the original array unchanged
 * when the move is not possible, so callers can skip a pointless write.
 */
export const moveVisibleBoard = (allIds, visibleIds, boardId, delta) => {
  const from = visibleIds.indexOf(boardId);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= visibleIds.length) {
    return allIds;
  }
  return swapBoardIds(allIds, boardId, visibleIds[to]);
};
