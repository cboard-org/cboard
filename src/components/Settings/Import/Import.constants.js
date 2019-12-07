import {
  cboardImportAdapter,
  obzImportAdapter,
  obfImportAdapter
} from './Import.helpers';
import {
  CBOARD_EXT_PROPERTIES as EXPORT_CBOARD_EXT_PROPERTIES,
  CBOARD_EXT_PREFIX as EXPORT_CBOARD_EXT_PREFIX
} from '../Export/Export.constants';

export const IMPORT_CONFIG_BY_EXTENSION = {
  json: cboardImportAdapter,
  zip: obzImportAdapter,
  obz: obzImportAdapter,
  obf: obfImportAdapter
};

export const IMPORT_PATHS = {
  boards: '.obf',
  images: 'images/'
};

export const CBOARD_EXT_PREFIX = EXPORT_CBOARD_EXT_PREFIX;

export const CBOARD_EXT_PROPERTIES = EXPORT_CBOARD_EXT_PROPERTIES;

export default {
  IMPORT_CONFIG_BY_EXTENSION,
  IMPORT_PATHS,
  CBOARD_EXT_PREFIX,
  CBOARD_EXT_PROPERTIES
};
