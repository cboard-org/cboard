import R from 'ramda';
import { createStructuredSelector, createSelector } from 'reselect';

// For this example file, I'll write it the way I would for a PR review at work.

const selectBoardData = R.propOr({}, 'board');

// You can compose and re-use selectors:
const selectBoardsList = createSelector(
  selectBoardData,
  R.propOr([], 'boards')
);
const selectNavHistory = createSelector(
  selectBoardData,
  R.propOr([], 'navHistory')
);
const selectActiveBoardId = createSelector(
  selectBoardData,
  R.propOr(null, 'activeBoardId')
);
const selectActiveBoard = createSelector(
  selectBoardsList,
  selectActiveBoardId,
  // (boards, activeBoardId) => R.find(R.propEq('id', activeBoardId))(boards)
  (boards, activeBoardId) => boards.find(R.propEq('id', activeBoardId))
);

// Since this is also used in `Speech.selectors.js` it could be moved to a shared "raw selectors" library and imported in both.
const selectLanguage = R.prop('language');
const selectLanguageDir = createSelector(selectLanguage, R.propOr('', 'dir'));

const boardConnector = createStructuredSelector({
  board: selectActiveBoard,
  navHistory: selectNavHistory,
  dir: selectLanguageDir
});

export default boardConnector;
