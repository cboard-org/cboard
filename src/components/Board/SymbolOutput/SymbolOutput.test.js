import React from 'react';
import { shallow } from 'enzyme';

import Symbol from '../../Symbol';
import SymbolOutput from './SymbolOutput';

it('renders without crashing', () => {
  shallow(<SymbolOutput />);
});

it('renders with child <Symbol />', () => {
  const props = {
    values: [{ label: 'label', img: '/folder/img.svg' }],
    onClick: () => {},
    onChange: () => {}
  };
  const wrapper = shallow(<SymbolOutput {...props} />);
  console.log(wrapper.contains(<Symbol />));
  console.log('---------------------------------');
  expect(wrapper.contains(<Symbol />)).toEqual(true);
});

// it('renders with correct label', () => {
//   const props = {
//     label: 'dummy label'
//   };
//   const wrapper = shallow(<SymbolOutput {...props} />);
//   expect(wrapper.find(Symbol).prop('label')).toEqual(props.label);
// });

// it('renders with correct image', () => {
//   const props = {
//     img: 'path/to/img.svg'
//   };
//   const wrapper = shallow(<SymbolOutput {...props} />);
//   expect(wrapper.find(Symbol).prop('src')).toEqual(props.image);
// });

// it('renders with a folder className', () => {
//   const folderClassName = 'BoardButton--folder';
//   const props = {
//     loadBoard: 'boardId'
//   };
//   const wrapper = shallow(<SymbolOutput {...props} />);
//   expect(wrapper.hasClass(folderClassName)).toEqual(true);
// });

// it('on button click', () => {
//   const props = {
//     id: '42',
//     onClick: jest.fn()
//   };
//   const wrapper = shallow(<SymbolOutput {...props} />);
//   wrapper.simulate('click');
//   expect(props.onClick.mock.calls.length).toEqual(1);
//   expect(props.onClick.mock.calls[0][0].id).toEqual(props.id);
// });
