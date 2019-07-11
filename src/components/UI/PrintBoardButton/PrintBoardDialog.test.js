import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import PrintBoardDialog from './PrintBoardDialog.component';

jest.mock('./PrintBoardButton.messages', () => {
  return {
    printBoard: {
      id: 'cboard.components.PrintBoardButton.printBoard',
      defaultMessage: 'Print Board'
    },
    printBoardSecondary: {
      id: 'cboard.components.PrintBoardButton.printBoardSecondary',
      defaultMessage:
        'Print current board or full board set (it can take a while).'
    },
    printCurrentBoard: {
      id: 'cboard.components.PrintBoardButton.printCurrentBoard',
      defaultMessage: 'Current Board'
    },
    printFullBoardSet: {
      id: 'cboard.components.PrintBoardButton.printFullBoardSet',
      defaultMessage: 'Full Board Set'
    }
  };
});

const props = {
  title: 'PrintBoardDialog Title',
  onClose: () => {},
  onPrintCurrentBoard: () => {},
  onPrintFullBoardSet: () => {}
};

describe('PrintBoardDialog tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<PrintBoardDialog {...props} />);
  });

  test('open dialog', () => {
    shallowMatchSnapshot(<PrintBoardDialog {...props} open />);
  });

  test('loading renderer', () => {
    shallowMatchSnapshot(<PrintBoardDialog {...props} open loading />);
  });
});
