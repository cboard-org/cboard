import React from 'react';
import { mount } from 'enzyme';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import { shallowMatchSnapshot } from '../../../../common/test_utils';
import LockToggle from '../LockToggle';

jest.mock('../LockToggle.messages', () => ({
  lock: {
    id: 'cboard.components.LockToggle.lock',
    defaultMessage: 'Lock'
  },
  unlock: {
    id: 'cboard.components.LockToggle.unlock',
    defaultMessage: 'Unlock'
  }
}));

describe('LockToggle tests', () => {
  it('default renderer', () => {
    shallowMatchSnapshot(<LockToggle onClick={() => {}} />);
  });

  it('should render with unlocked icon', () => {
    const props = {
      onClick: () => {},
      locked: false
    };
    const wrapper = mount(<LockToggle {...props} />);

    expect(wrapper.find(LockOpenIcon)).toHaveLength(1);
  });

  it('should render with locked icon', () => {
    const props = {
      onClick: () => {},
      locked: true
    };
    const wrapper = mount(<LockToggle {...props} />);

    expect(wrapper.find(LockOutlinedIcon)).toHaveLength(1);
  });

  it('should click with locked icon', () => {
    const props = {
      onClick: () => {},
      locked: true,
      onLockTick: () => {}
    };
    const wrapper = mount(<LockToggle {...props} />);

    wrapper.simulate('click');
  });
});
