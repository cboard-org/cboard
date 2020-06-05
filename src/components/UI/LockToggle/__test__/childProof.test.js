import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import childProof from '../childProof';

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

describe('childProof tests', () => {
  it('default renderer', () => {
    const snapshot = renderer.create(
      <childProof onClick={() => {}} onLockTick={() => {}} />
    );
    expect(snapshot).toMatchSnapshot();
  });
  it('default renderer', () => {
    const wrapper = shallow(
      <childProof onClick={() => {}} onLockTick={() => {}} />
    );
    wrapper.simulate('click');
  });
});
