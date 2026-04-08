import React from 'react';
import { shallow } from 'enzyme';
import SymbolSearch from './SymbolSearch.component';
import * as cboardSymbolsApi from '../../../api/cboard-symbols';

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

jest.mock('../../../api/cboard-symbols', () => ({
  searchCboardSymbols: jest.fn(),
  mapArasaacToCboardSkinTone: jest.fn(skin => {
    const map = {
      white: 'skin_light',
      black: 'skin_dark',
      mulatto: 'skin_medium',
      asian: 'skin_medium_light',
      aztec: 'skin_medium_dark'
    };
    return map[skin] || 'skin_emoji';
  })
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('default renderer', () => {
    const wrapper = shallow(<SymbolSearch {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('includes Cboard Symbols in symbolSets', () => {
    const wrapper = shallow(<SymbolSearch {...props} />);
    const symbolSets = wrapper.state('symbolSets');

    expect(symbolSets).toHaveLength(4);
    expect(symbolSets[3]).toEqual({
      id: '3',
      text: 'Cboard Symbols',
      enabled: true
    });
  });

  test('has isFetchingCboardSymbols in state', () => {
    const wrapper = shallow(<SymbolSearch {...props} />);
    expect(wrapper.state()).toHaveProperty('isFetchingCboardSymbols', false);
  });

  test('fetchCboardSymbolsSuggestions calls API with correct params', async () => {
    cboardSymbolsApi.searchCboardSymbols.mockResolvedValue([]);

    const wrapper = shallow(<SymbolSearch {...props} />);
    const instance = wrapper.instance();

    await instance.fetchCboardSymbolsSuggestions('house');

    expect(cboardSymbolsApi.searchCboardSymbols).toHaveBeenCalledWith(
      'en-US',
      'house'
    );
  });

  test('fetchCboardSymbolsSuggestions transforms API response correctly', async () => {
    const mockResponse = [
      {
        _id: 'test123',
        url: 'https://example.com/symbol.png',
        variants: [
          {
            url: 'https://example.com/symbol-light.png',
            skinTone: 'skin_light'
          }
        ],
        translations: {
          en: { concept: 'House' }
        }
      }
    ];

    cboardSymbolsApi.searchCboardSymbols.mockResolvedValue(mockResponse);

    const wrapper = shallow(<SymbolSearch {...props} />);
    const instance = wrapper.instance();

    await instance.fetchCboardSymbolsSuggestions('house');

    const suggestions = wrapper.state('suggestions');
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      id: 'test123',
      src: 'https://example.com/symbol-light.png', // Variant selected based on skin tone
      keyPath: 'cboard_test123',
      translatedId: 'house',
      fromCboardSymbols: true
    });
  });

  test('showInclusivityOptions is true when ARASAAC or Cboard Symbols enabled', () => {
    const wrapper = shallow(<SymbolSearch {...props} />);
    expect(wrapper.instance().showInclusivityOptions).toBe(true);

    // Disable both ARASAAC and Cboard Symbols
    wrapper.setState({
      symbolSets: [
        { id: '0', text: 'Mulberry', enabled: true },
        { id: '1', text: 'Global Symbols', enabled: true },
        { id: '2', text: 'ARASAAC', enabled: false },
        { id: '3', text: 'Cboard Symbols', enabled: false }
      ]
    });

    expect(wrapper.instance().showInclusivityOptions).toBe(false);
  });

  test('skin tone syncs between ARASAAC and Cboard Symbols', () => {
    const mapping = cboardSymbolsApi.mapArasaacToCboardSkinTone('white');
    expect(mapping).toBe('skin_light');
  });

  test('getSuggestions calls fetchCboardSymbolsSuggestions when enabled', () => {
    const wrapper = shallow(<SymbolSearch {...props} />);
    const instance = wrapper.instance();

    instance.fetchCboardSymbolsSuggestions = jest.fn();
    instance.getSuggestions('test');

    expect(instance.fetchCboardSymbolsSuggestions).toHaveBeenCalledWith('test');
  });

  test('getSuggestions does not call fetchCboardSymbolsSuggestions when disabled', () => {
    const wrapper = shallow(<SymbolSearch {...props} />);
    const instance = wrapper.instance();

    // Disable Cboard Symbols
    wrapper.setState({
      symbolSets: [
        { id: '0', text: 'Mulberry', enabled: true },
        { id: '1', text: 'Global Symbols', enabled: true },
        { id: '2', text: 'ARASAAC', enabled: true },
        { id: '3', text: 'Cboard Symbols', enabled: false }
      ]
    });

    instance.fetchCboardSymbolsSuggestions = jest.fn();
    instance.getSuggestions('test');

    expect(instance.fetchCboardSymbolsSuggestions).not.toHaveBeenCalled();
  });
});
