import { defineMessages } from 'react-intl';

export default defineMessages({
  export: {
    id: 'cboard.components.Settings.Export.export',
    defaultMessage: 'Export'
  },
  exportSecondary: {
    id: 'cboard.components.Settings.Export.exportSecondary',
    defaultMessage:
      'This option will export ALL the boards you have if you choose {cboardLink} format or {link} format. It will export JUST the current board if you choose PDF format.'
  },
  boardDownloaded: {
    id: 'cboard.components.Settings.Export.boardDownloaded',
    defaultMessage: 'Your board(s) was downloaded'
  },
  boardDownloadedCva: {
    id: 'cboard.components.Settings.Export.boardDownloadedCva',
    defaultMessage:
      'Your board was downloaded. Find your file under the downloads folder'
  }
});
