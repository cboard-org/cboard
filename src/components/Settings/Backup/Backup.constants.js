import { openboardExportAdapter } from './Backup.helpers';

export const CBOARD_CONSTANTS = {
  DATA_URL: 'http://myboards.net/api/v1/boards/',
  URL: 'http://myboards.net/boards/',
  LICENSE: {
    type: 'CC-By',
    copyright_notice_url: 'http://creativecommons.org/licenses/by',
    source_url: 'https://github.com/shayc/cboard',
    author_name: 'Shay Cojocaru',
    author_url: 'https://github.com/shayc',
    author_email: 'shayc@outlook.com'
  }
};

export const CBOARD_COLUMNS = 6;
export const CBOARD_EXT_PREFIX = 'ext_cboard_';
export const CBOARD_EXT_PROPERTIES = ['labelKey'];

export const EXPORT_CONFIG_BY_TYPE = {
  cboard: {
    filename: 'board.json',
    callback: null
  },
  openboard: {
    filename: 'board.obz',
    callback: openboardExportAdapter
  }
};
