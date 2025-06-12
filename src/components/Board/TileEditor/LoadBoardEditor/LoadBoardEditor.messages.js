import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmationTitle: {
    id: 'cboard.components.LoadBoardEditor.confirmationTitle',
    defaultMessage: 'Are you sure you want to change the board this tile opens?'
  },
  openBoardInNewTab: {
    id: 'cboard.components.LoadBoardEditor.openBoardInNewTab',
    defaultMessage: 'view in new tab'
  },
  accept: {
    id: 'cboard.components.LoadBoardEditor.accept',
    defaultMessage: 'Accept'
  },
  cancel: {
    id: 'cboard.components.LoadBoardEditor.cancel',
    defaultMessage: 'Cancel'
  },
  searchFolder: {
    id: 'cboard.components.LoadBoardEditor.searchFolder',
    defaultMessage: 'Search folder'
  },
  searchForAFolder: {
    id: 'cboard.components.LoadBoardEditor.searchForAFolder',
    defaultMessage: 'Search for a folder'
  },
  searchPlaceholder: {
    id: 'cboard.components.LoadBoardEditor.searchPlaceholder',
    defaultMessage: 'Search…'
  },
  errorGettingFolders: {
    id: 'cboard.components.LoadBoardEditor.errorGettingFolders',
    defaultMessage:
      'Error getting all your folders. Please be sure that you have internet connection to use this feature.'
  },
  tryAgain: {
    id: 'cboard.components.LoadBoardEditor.tryAgain',
    defaultMessage: 'Try Again'
  },
  noBoardsFound: {
    id: 'cboard.components.LoadBoardEditor.noBoardsFound',
    defaultMessage: 'No boards found for: '
  }
});
