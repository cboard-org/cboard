import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import SymbolSearch from './SymbolSearch.component';

jest.mock('./SymbolSearch.messages', () => {
  return {
    searchSymbolLibrary: {
      id: 'cboard.components.SymbolSearch.searchSymbolLibrary',
      defaultMessage: 'Search symbol library'
    },
    uploadAnImage: {
      id: 'cboard.components.InputImage.uploadImage',
      defaultMessage: 'Upload an image'
    }
  };
});

describe('SymbolSearch tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<SymbolSearch onClose={() => { }} />);
  });
});
