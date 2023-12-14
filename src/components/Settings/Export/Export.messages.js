import { defineMessages } from 'react-intl';

export default defineMessages({
  export: {
    id: 'cboard.components.Settings.Export.export',
    defaultMessage: 'Export'
  },
  exportSingle: {
    id: 'cboard.components.Settings.Export.exportSingle',
    defaultMessage: 'Export a single board'
  },
  exportSingleSecondary: {
    id: 'cboard.components.Settings.Export.exportSingleSecondary',
    defaultMessage:
      'This option will export a single board you have from a list of boards. You can choose {cboardLink}, {link} or PDF formats.'
  },
  exportAll: {
    id: 'cboard.components.Settings.Export.exportAll',
    defaultMessage: 'Export All Boards'
  },
  exportAllSecondary: {
    id: 'cboard.components.Settings.Export.exportAllSecondary',
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
  },
  boardDownloadedCvaIOS: {
    id: 'cboard.components.Settings.Export.boardDownloadedCvaIOS',
    defaultMessage:
      'Your board was downloaded. Find your file under "On My device" folder'
  },
  boards: {
    id: 'cboard.components.Settings.Export.boards',
    defaultMessage: 'Boards'
  },
  boardDownloadError: {
    id: 'cboard.components.Settings.Export.boardDownloadedError',
    defaultMessage: 'Ups..Something went wrong. Please try again'
  },
  downloadNoConnectionError: {
    id: 'cboard.components.Settings.Export.downloadNoConnectionError',
    defaultMessage: 'Need internet connection to download the PDF.'
  },
  pdfSettings: {
    id: 'cboard.components.Settings.Export.pdfSettings',
    defaultMessage: 'PDF Settings'
  },
  fontSize: {
    id: 'cboard.components.Settings.Export.fontSize',
    defaultMessage: 'Font size'
  },
  fontSizeSecondary: {
    id: 'cboard.components.Settings.Export.fontSizeSecondary',
    defaultMessage:
      'Select the desired font size. This option is useful if you have problems with the dimensions of the exported board.'
  },
  small: {
    id: 'cboard.components.Settings.Export.small',
    defaultMessage: 'Small'
  },
  medium: {
    id: 'cboard.components.Settings.Export.medium',
    defaultMessage: 'Medium'
  },
  large: {
    id: 'cboard.components.Settings.Export.large',
    defaultMessage: 'Large'
  }
});
