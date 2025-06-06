import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import FullScreenButton from './FullScreenButton';
import { doc } from 'prettier';

jest.mock('./FullScreenButton.messages', () => {
  return {
    fullscreen: {
      id: 'cboard.components.FullScreenButton.fullscreen',
      defaultMessage: 'Full screen'
    },
    exitFullscreen: {
      id: 'cboard.components.FullScreenButton.exitFullscreen',
      defaultMessage: 'Exit full screen'
    }
  };
});

describe('FullScreenButton tests', () => {
  beforeEach(() => {
    document.documentElement.requestFullscreen = jest.fn(() =>
      Promise.resolve()
    );
    document.exitFullscreen = jest.fn(() => Promise.resolve());
  });
  test('default renderer', () => {
    shallowMatchSnapshot(<FullScreenButton onClick={() => {}} />);
  });
  test('on button click', () => {
    const wrapper = mount(
      <FullScreenButton
        disabled={false}
        intl={{ formatMessage: msg => msg.defaultMessage }}
      />
    );
    const button = wrapper.find('button');
    button.simulate('click');
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    button.simulate('click');
    expect(document.exitFullscreen).toHaveBeenCalled();
  });
});
