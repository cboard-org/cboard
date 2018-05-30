import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import Import from './Import.component';

jest.mock('./Import.messages', () => {
  return {
    import: {
      id: 'cboard.components.Settings.Import.import',
      defaultMessage: 'Import'
    },
    restore: {
      id: 'cboard.components.Settings.Import.restore',
      defaultMessage: 'Restore'
    },
    exportSecondary: {
      id: 'cboard.components.Settings.Import.importSecondary',
      defaultMessage: 'Backup your boards'
    }
  };
});

const COMPONENT_PROPS = {
  onImportClick: () => {},
  onClose: () => {}
};

describe('Import tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Import {...COMPONENT_PROPS} />);
  });
});
