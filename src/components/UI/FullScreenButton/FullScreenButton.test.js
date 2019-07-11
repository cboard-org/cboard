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
  test('default renderer', () => {
    shallowMatchSnapshot(<FullScreenButton onClick={() => {}} />);
  });
  test('on buttton click', () => {
    const wrapper = mount(
      shallow(<FullScreenButton disabled={false} />).get(0)
    );
    wrapper.simulate('click');
    expect(wrapper.state().fullscreen).toEqual(true);
    wrapper.simulate('click');
    expect(wrapper.state().fullscreen).toEqual(false);
  });
  test('on buttton click', () => {
    global.window.document.requestFullscreen = jest.fn();
    const wrapper = mount(
      shallow(<FullScreenButton disabled={false} />).get(0)
    );
    wrapper.simulate('click');
    expect(wrapper.state().fullscreen).toEqual(true);
    wrapper.simulate('click');
    expect(wrapper.state().fullscreen).toEqual(false);
  });
});
