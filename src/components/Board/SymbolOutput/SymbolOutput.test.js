import React from 'react';
import { shallow } from 'enzyme';

import Symbol from '../../Symbol';
import { SymbolOutput } from './SymbolOutput.component';

const cssClasses = {
  SCROLL_CONTAINER: 'SymbolOutput__scroll-container',
  BACKSPACE: 'SymbolOutput__backspace',
  CLEAR: 'SymbolOutput__clear'
};

const valuesProp = [
  {
    label: 'label',
    img: 'folder/img.svg'
  },
  {
    label: 'label2',
    img: 'folder/img2.svg'
  }
];

it('renders without crashing', () => {
  const props = {
    onClick: () => {},
    onChange: () => {}
  };
  shallow(<SymbolOutput {...props} />);
});

it('renders with child <Symbol /> and correct props', () => {
  const props = {
    values: [{ label: 'label', img: '/folder/img.svg' }],
    onClick: () => {},
    onChange: () => {}
  };
  const wrapper = shallow(<SymbolOutput {...props} />);
  expect(wrapper.contains(<Symbol {...props.values[0]} />)).toEqual(true);
});

it('renders with 2 child <Symbol />', () => {
  const props = {
    values: valuesProp,
    onClick: () => {},
    onChange: () => {}
  };
  const wrapper = shallow(<SymbolOutput {...props} />);
  expect(wrapper.find(Symbol).length).toEqual(2);
});

it('renders in correct direction', () => {
  const direction = 'rtl';
  const invertedDir = 'ltr';
  const props = {
    dir: direction,
    onChange: () => {},
    onClick: () => {}
  };

  const wrapper = shallow(<SymbolOutput {...props} />);
  const scrollContainer = wrapper.find(`.${cssClasses.SCROLL_CONTAINER}`);
  expect(scrollContainer.props().style.direction).toEqual(invertedDir);
});

it('on scroll container click', () => {
  const props = {
    values: valuesProp,
    onClick: jest.fn(),
    onChange: () => {}
  };

  const wrapper = shallow(<SymbolOutput {...props} />);
  const scrollContainer = wrapper.find(`.${cssClasses.SCROLL_CONTAINER}`);
  scrollContainer.simulate('click');

  expect(props.onClick.mock.calls.length).toEqual(1);
  expect(props.onClick.mock.calls[0][0].length).toEqual(props.values.length);
  expect(props.onClick.mock.calls[0][0][0]).toEqual(props.values[0]);
  expect(props.onClick.mock.calls[0][0][0]).toEqual(props.values[0]);
  expect(props.onClick.mock.calls[0][0][1]).toEqual(props.values[1]);
});

it('on clear button click', () => {
  const props = {
    values: valuesProp,
    onClick: () => {},
    onChange: jest.fn()
  };

  const wrapper = shallow(<SymbolOutput {...props} />);
  const clearButton = wrapper.find(`.${cssClasses.CLEAR}`);
  clearButton.simulate('click');

  expect(props.onChange.mock.calls.length).toEqual(1);
  expect(props.onChange.mock.calls[0][0]).toEqual([]);
});

it('on backspace button click', () => {
  const props = {
    values: valuesProp,
    onClick: () => {},
    onChange: jest.fn()
  };

  const expectedValues = [...props.values];
  expectedValues.pop();

  const wrapper = shallow(<SymbolOutput {...props} />);
  const backspaceButton = wrapper.find(`.${cssClasses.BACKSPACE}`);
  backspaceButton.simulate('click');

  expect(props.onChange.mock.calls.length).toEqual(1);
  expect(props.onChange.mock.calls[0][0]).toEqual(expectedValues);
});

it('unset tabindex when no values prop', () => {
  const props = {
    onClick: () => {},
    onChange: () => {}
  };

  const wrapper = shallow(<SymbolOutput {...props} />);
  const scrollContainer = wrapper.find(`.${cssClasses.SCROLL_CONTAINER}`);
  expect(scrollContainer.props().tabIndex).toEqual('-1');
});

it('set tabindex when values prop is not empty', () => {
  const props = {
    values: valuesProp,
    onClick: () => {},
    onChange: () => {}
  };

  const wrapper = shallow(<SymbolOutput {...props} />);
  const scrollContainer = wrapper.find(`.${cssClasses.SCROLL_CONTAINER}`);
  expect(scrollContainer.props().tabIndex).toEqual('0');
});
