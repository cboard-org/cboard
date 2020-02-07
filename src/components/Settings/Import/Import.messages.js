import { defineMessages } from 'react-intl';

export default defineMessages({
  import: {
    id: 'cboard.components.Settings.Import.import',
    defaultMessage: 'Import'
  },
  importSecondary: {
    id: 'cboard.components.Settings.Import.importSecondary',
    defaultMessage:
      'This option will import JUST the new boards detected. It WILL NOT import the default boards included on Cboard. Supported formats are {cboardLink} format or {link} format.'
  },
  success: {
    id: 'cboard.components.Settings.Import.success',
    defaultMessage: 'Success!! {boards} boards were imported successfully.'
  },
  emptyImport: {
    id: 'cboard.components.Settings.Import.emptyImport',
    defaultMessage: 'WARNING: There is nothing to import from the current file.'
  },
  errorImport: {
    id: 'cboard.components.Settings.Import.errorImport',
    defaultMessage:
      'WARNING: There was an error trying to import from the current file.'
  },
  invalidImport: {
    id: 'cboard.components.Settings.Import.invalidImport',
    defaultMessage: 'Please, select a valid file: json, obz, obf'
  },
  noImport: {
    id: 'cboard.components.Settings.Import.noImport',
    defaultMessage: 'WARNING: There is no selected file.'
  }
});
