import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { mount, shallow } from 'enzyme';
import InputImage from './InputImage.component';

jest.mock('browser-image-resizer');
jest.mock('../../../api/api');

jest.mock('./InputImage.messages', () => {
  return {
    uploadImage: {
      id: 'cboard.components.InputImage.uploadImage',
      defaultMessage: 'Upload image'
    }
  };
});

describe('InputImage tests', () => {
  test('default render ', () => {
    const onChange = jest.fn();
    const wrapper = mount(<InputImage disabled={false} onChange={onChange} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('on buttton click', () => {
    const onChange = jest.fn();
    const event = {
      target: {
        files: [new File(['foo'], 'foo.txt')]
      }
    };
    const wrapper = mount(
      <InputImage
        user={{ email: 'test' }}
        disabled={false}
        onChange={onChange}
      />
    );
    wrapper.find('input').prop('onChange')(event);
  });
});
