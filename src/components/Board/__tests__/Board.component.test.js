import React from 'react';
import { shallow, mount } from 'enzyme';

import Board from '../Board.component';
jest.mock('../Board.messages', () => ({
  editTitle: {
    id: 'cboard.components.Board.editTitle',
    defaultMessage: 'Edit Board Title'
  },
  boardTitle: {
    id: 'cboard.components.Board.boardTitle',
    defaultMessage: 'Board Title'
  }
}));

it('renders without crashing', () => {
  const props = {
    board: {
      id: 'root',
      name: 'home',
      author: 'Cboard',
      email: 'support@cboard.io',
      isPublic: true,
      hidden: false,
      tiles: [
        {
          labelKey: 'cboard.symbol.yes',
          image: '/symbols/mulberry/correct.svg',
          id: 'HJVQMR9pX5F-',
          backgroundColor: 'rgb(255, 241, 118)',
          label: 'yes'
        },
        {
          labelKey: 'symbol.descriptiveState.no',
          image: '/symbols/mulberry/no.svg',
          id: 'SkBQMRqpX5t-',
          backgroundColor: 'rgb(255, 241, 118)',
          label: 'no'
        }
      ]
    }
  };
  shallow(<Board {...props} />);
});

// it('renders with button child', () => {
//   const wrapper = mount(<Tile />);
//   expect(wrapper.find('button')).toHaveLength(1);
// });

// it('renders with <Scannable /> child', () => {
//   const props = {
//     label: 'dummy label',
//     img: 'path/to/img.svg'
//   };
//   const wrapper = mount(<Tile {...props} />);
//   const scannable = wrapper.find(Scannable);
//   expect(scannable.length).toEqual(1);
// });

// it('renders with a folder className', () => {
//   const folderClassName = 'Tile--folder';
//   const props = {
//     variant: 'folder'
//   };
//   const wrapper = mount(<Tile {...props} />);
//   expect(wrapper.find('button').hasClass(folderClassName)).toEqual(true);
// });

// it('Tile is a stateless functional component', () => {
//   const wrapper = shallow(<Tile />);
//   const instance = wrapper.instance();
//   expect(instance).toEqual(null);
// });

// it('on tile focus', () => {
//   const props = {
//     id: '42',
//     onFocus: jest.fn()
//   };
//   const wrapper = shallow(<Tile {...props} />);
//   wrapper.find('button').simulate('focus');
//   expect(props.onFocus.mock.calls.length).toEqual(1);
// });

// it('on tile click', () => {
//   const props = {
//     id: '42',
//     variant: 'button',
//     onClick: jest.fn()
//   };
//   const wrapper = shallow(<Tile {...props} />);
//   wrapper.find('button').simulate('click');
//   expect(props.onClick.mock.calls.length).toEqual(1);
// });

// it('on tile click and props', () => {
//   const props = {
//     id: '42',
//     variant: 'button',
//     borderColor: '#fffff',
//     backgroundColor: '#fffff',
//     variant: 'folder',
//     onClick: jest.fn(),
//     onSelect: jest.fn()
//   };
//   const wrapper = shallow(<Tile {...props} />);
// });
