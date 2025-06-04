import React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import FullScreenButton from './FullScreenButton';

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
    document.exitFullscreen = jest.fn();
    document.documentElement.requestFullscreen = jest.fn();
  });

  test('default renderer', () => {
    shallowMatchSnapshot(<FullScreenButton onClick={() => {}} />);
  });
  test('on buttton click', () => {
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
  test('on buttton click', () => {
    global.window.document.fullscreenElement = jest.fn();
    const wrapper = mount(
      shallow(<FullScreenButton disabled={false} />).get(0)
    );
    const button = wrapper.find('button');
    button.simulate('click');
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    button.simulate('click');
    expect(document.exitFullscreen).toHaveBeenCalled;
  });
});
