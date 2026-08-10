import { defineMessages } from 'react-intl';

export default defineMessages({
  loadingBoard: {
    id: 'cboard.components.AccessViewer.loadingBoard',
    defaultMessage: 'Loading board...'
  },
  invalidTitle: {
    id: 'cboard.components.AccessViewer.invalidTitle',
    defaultMessage: 'Invalid or expired access code'
  },
  invalidDescription: {
    id: 'cboard.components.AccessViewer.invalidDescription',
    defaultMessage:
      'The access code you are trying to use does not exist or has expired. Contact the establishment for more information.'
  },
  forbiddenTitle: {
    id: 'cboard.components.AccessViewer.forbiddenTitle',
    defaultMessage: 'Access not allowed'
  },
  forbiddenDescription: {
    id: 'cboard.components.AccessViewer.forbiddenDescription',
    defaultMessage: 'This board is not available with the provided code.'
  },
  errorTitle: {
    id: 'cboard.components.AccessViewer.errorTitle',
    defaultMessage: 'Connection error'
  },
  errorDescription: {
    id: 'cboard.components.AccessViewer.errorDescription',
    defaultMessage:
      'We could not load the board. Please check your connection and try again.'
  }
});
