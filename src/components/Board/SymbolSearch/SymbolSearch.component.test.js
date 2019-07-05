import React from 'react';
import { shallow } from 'enzyme';
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
  const props = {
    intl: {
      formatMessage: jest.fn(),
      locale: 'en-US'
    },
    open: true,
    maxSuggestions: 7,
    onChange: jest.fn(),
    onClose: jest.fn()
  };
  test('default renderer', () => {
    const wrapper = shallow(<SymbolSearch {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
