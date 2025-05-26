import {
  LABEL_POSITION_ABOVE,
  LABEL_POSITION_BELOW,
  LABEL_POSITION_HIDDEN
} from '../Display/Display.constants';

export const CBOARD_OBF_CONSTANTS = {
  DATA_URL: 'http://app.cboard.io/api/v1/boards/',
  URL: 'http://app.cboard.io/boards/',
  LICENSE: {
    type: 'CC-By',
    copyright_notice_url: 'http://creativecommons.org/licenses/by',
    source_url: 'https://github.com/cboard-org',
    author_name: 'Cboard',
    author_url: 'https://www.cboard.io',
    author_email: 'support@cboard.io'
  }
};

export const CBOARD_ZIP_OPTIONS = {
  type: 'blob',
  compression: 'DEFLATE',
  platform: 'UNIX'
};

export const CBOARD_COLUMNS = 6;
export const CBOARD_ROWS = 4;
export const CBOARD_EXT_PREFIX = 'ext_cboard_';
export const CBOARD_EXT_PROPERTIES = ['labelKey', 'nameKey', 'hidden'];
export const NOT_FOUND_IMAGE =
  'data:image/jpeg;base64,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';
export const EMPTY_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export const PICSEEPAL_GRID_WIDTH = 553;
export const PDF_GRID_WIDTH = 800;
export const PDF_BORDER_WIDTH = 2;
export const SMALL_FONT_SIZE = 9;
export const MEDIUM_FONT_SIZE = 12;
export const LARGE_FONT_SIZE = 16;

export const EXPORT_CONFIG_BY_TYPE = {
  cboard: {
    filename: 'board.json',
    callback: 'cboardExportAdapter'
  },
  openboard: {
    filename: 'board.obz',
    callback: 'openboardExportAdapter'
  },
  pdf: {
    filename: 'board.pdf',
    callback: 'pdfExportAdapter'
  },
  picsee_pdf: {
    filename: 'picsee_board.pdf',
    callback: 'pdfExportAdapter'
  }
};

export const PDF_GRID_BORDER = {
  [LABEL_POSITION_BELOW]: {
    imageData: [true, true, true, false],
    labelData: [true, false, true, true]
  },
  [LABEL_POSITION_ABOVE]: {
    imageData: [true, false, true, true],
    labelData: [true, true, true, false]
  },
  [LABEL_POSITION_HIDDEN]: {
    imageData: [true, true, true, false],
    labelData: [true, false, true, true]
  }
};

export const FONTS = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Regular.ttf'
  },
  Khmer: {
    normal: 'Khmer-Regular.ttf',
    bold: 'Khmer-Regular.ttf'
  },
  Tajawal: {
    normal: 'Tajawal-Regular.ttf',
    bold: 'Tajawal-Regular.ttf'
  },
  Sarabun: {
    normal: 'Sarabun-Regular.ttf',
    bold: 'Sarabun-Regular.ttf'
  },
  Hind: {
    normal: 'Hind-Regular.ttf',
    bold: 'Hind-Regular.ttf'
  },
  NotoSansHebrew: {
    normal: 'NotoSansHebrew-Regular.ttf',
    bold: 'NotoSansHebrew-Regular.ttf'
  },
  NotoSansJP: {
    normal:
      'https://cboardgroupqadiag.blob.core.windows.net/fonts/NotoSansJP-Regular.ttf',
    bold:
      'https://cboardgroupqadiag.blob.core.windows.net/fonts/NotoSansJP-Regular.ttf'
  },
  NotoSansKR: {
    normal:
      'https://cboardgroupqadiag.blob.core.windows.net/fonts/NotoSansKR.otf',
    bold: 'https://cboardgroupqadiag.blob.core.windows.net/fonts/NotoSansKR.otf'
  },
  AnekDevanagari: {
    normal: 'AnekDevanagari-Regular.ttf',
    bold: 'AnekDevanagari-Regular.ttf'
  },
  NotoSansSC: {
    normal:
      'https://cboardgroupqadiag.blob.core.windows.net/fonts/NotoSansSC-Regular.otf',
    bold:
      'https://cboardgroupqadiag.blob.core.windows.net/fonts/NotoSansSC-Regular.otf'
  },
  NotoSerifBengali: {
    normal: 'NotoSerifBengali-Regular.ttf',
    bold: 'NotoSerifBengali-Regular.ttf'
  }
};

export const PICSEEPAL_IMAGES_WIDTH = {
  column: {
    1: 130,
    2: 130,
    3: 80,
    4: 84,
    5: 75,
    6: 60,
    7: 55,
    8: 55,
    9: 45,
    10: 45,
    11: 40,
    12: 37
  },
  row: {
    1: 130,
    2: 130,
    3: 86,
    4: 59,
    5: 45,
    6: 33,
    7: 29,
    8: 23,
    9: 17,
    10: 14,
    11: 11,
    12: 9
  }
};

export const PDF_IMAGES_WIDTH = {
  column: {
    1: 130,
    2: 130,
    3: 130,
    4: 100,
    5: 100,
    6: 100,
    7: 100,
    8: 90,
    9: 80,
    10: 70,
    11: 70,
    12: 60
  },
  row: {
    1: 130,
    2: 130,
    3: 130,
    4: 100,
    5: 80,
    6: 60,
    7: 50,
    8: 40,
    9: 35,
    10: 30,
    11: 30,
    12: 25
  }
};
