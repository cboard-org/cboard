import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import SymbolSearch from './SymbolSearch.component';

// import { IntlProvider } from 'react-intl';

describe('SymbolSearch tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(
      // <IntlProvider locale="en">
      <SymbolSearch />
      // </IntlProvider>
    );
  });
});
