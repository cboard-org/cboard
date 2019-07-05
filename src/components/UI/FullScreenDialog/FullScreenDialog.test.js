import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import FullScreenDialog from './FullScreenDialog';

jest.mock('../../App/App.messages', () => {
  return {
    save: {
      id: 'cboard.components.App.save',
      defaultMessage: 'Save'
    },
    newContentAvailable: {
      id: 'cboard.components.App.newContentAvailable',
      defaultMessage: 'New content is available; please refresh.'
    },
    contentIsCached: {
      id: 'cboard.components.App.contentIsCached',
      defaultMessage: 'Content is cached for offline use.'
    }
  };
});

const props = {
  disableSubmit: false,
  open: true,
  title: 'test',
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  disableSubmit: false,
  transition: 'up'
};

describe('FullScreenDialog tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<FullScreenDialog {...props} />);
  });
  test('check transition', () => {
    const fade = { ...props, transition: 'fade' };
    const wrapper = shallow(<FullScreenDialog {...fade} />);
  });
});
