import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import RadioGroup from './RadioGroup';

describe('RadioGroup tests', () => {
  test('default renderer', () => {
    const children = [
      <div key="1">"first"</div>,
      <div key="2">"second"</div>,
      <div key="3">"third"</div>
    ];
    shallowMatchSnapshot(<RadioGroup>{children}</RadioGroup>);
  });
});
