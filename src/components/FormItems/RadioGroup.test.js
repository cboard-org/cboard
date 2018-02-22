import React from 'react';
import { shallowMatchSnapshot } from '../../common/test_utils';
import RadioGroup from './RadioGroup';

describe('RadioGroup tests', () => {
  test('default renderer', () => {
    const children = [
      <div>"first"</div>,
      <div>"second"</div>,
      <div>"third"</div>
    ];
    shallowMatchSnapshot(<RadioGroup>{children}</RadioGroup>);
  });
});
