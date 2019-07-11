import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import FormDialog from './FormDialog';

jest.mock('./FormDialog.messages', () => {
  return {
    save: {
      id: 'cboard.components.FormDialog.save',
      defaultMessage: 'Save'
    },
    cancel: {
      id: 'cboard.components.FormDialog.cancel',
      defaultMessage: 'Cancel'
    }
  };
});

const COMPONENT_PROPS = {};

describe('FormDialog tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<FormDialog {...COMPONENT_PROPS} />);
  });
  test('props renderer', () => {
    const props = {
      disableSubmit: () => {},
      open: true,
      title: 'oooo',
      description: 'dddd',
      onClose: () => {},
      onSubmit: () => {},
      classes: 'string',
      className: 'string',
      fullScreen: false
    };
    shallowMatchSnapshot(<FormDialog {...props} />);
  });
});
