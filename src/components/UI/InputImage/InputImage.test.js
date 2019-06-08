import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { mount, shallow } from 'enzyme';
import InputImage from './InputImage.component';

jest.mock('./InputImage.messages', () => {
  return {
    uploadImage: {
      id: 'cboard.components.InputImage.uploadImage',
      defaultMessage: 'Upload image'
    }
  };
});

describe('InputImage tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<InputImage onChange={() => {}} />);
  });

  test('on buttton click', () => {
    const wrapper = mount(
      shallow(<InputImage disabled={false} onChange={() => {}} />).get(0)
    );
    wrapper.simulate('click');
    expect(wrapper.state().loading).toEqual(false);
  });
});
