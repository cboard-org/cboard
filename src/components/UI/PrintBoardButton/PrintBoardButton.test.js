import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import PrintBoardButton from './PrintBoardButton.component';

describe('PrintBoardButton tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(
      <PrintBoardButton label="Print board" onClick={() => {}} />
    );
  });

  test('disabled button', () => {
    shallowMatchSnapshot(
      <PrintBoardButton label="Print board" onClick={() => {}} disabled />
    );
  });
});
