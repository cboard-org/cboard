import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowMatchSnapshot } from '../../../../../common/test_utils';

import BackspaceButton from './BackspaceButton';

describe('BackspaceButton tests', () => {
  it('default renderer', () => {
    shallowMatchSnapshot(<BackspaceButton />);
  });

  it('renders with LTR icon', () => {
    const props = {
      theme: { direction: 'ltr' }
    };
    const wrapper = mount(<BackspaceButton {...props} />);
    const backspaceIconProps = wrapper.find('BackspaceIcon').props();

    expect(backspaceIconProps).toHaveProperty('style', null);
  });

  it('renders with RTL icon', () => {
    const props = {
      theme: { direction: 'rtl' }
    };
    const wrapper = mount(<BackspaceButton {...props} />);
    const backspaceIconProps = wrapper.find('BackspaceIcon').props();

    expect(backspaceIconProps).toHaveProperty('style', {
      transform: 'scaleX(-1)'
    });
  });
});
