import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import Export from './Export.component';

jest.mock('./Export.messages', () => {
  return {
    export: {
      id: 'cboard.components.Settings.Export.export',
      defaultMessage: 'Export'
    },
    exportSecondary: {
      id: 'cboard.components.Settings.Export.exportSecondary',
      defaultMessage: 'Backup your boards'
    }
  };
});

const COMPONENT_PROPS = {
  onExportClick: () => {},
  onClose: () => {}
};

describe('Export tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Export {...COMPONENT_PROPS} />);
  });
});
