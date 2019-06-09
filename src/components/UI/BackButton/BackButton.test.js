import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import BackButton from './BackButton';

const intlMock = { formatMessage: () => 'dummy message' };

describe('BackButton tests', () => {
  test('default renderer', () => {
    const props = {
      intl: intlMock,
      theme: {},
      onClick: () => {}
    };
    shallowMatchSnapshot(<BackButton {...props} />);
  });
});
