import React from 'react';
import { shallow } from 'enzyme';
import { Grid } from './Grid';

const layouts = {
  lg: [],
  md: [],
  sm: [],
  xs: [],
  xxs: [],
}

it('renders without crashing', () => {
  const matchMediaMock = jest.fn();
  matchMediaMock.mockReturnValue({ matches: true });
  global.matchMedia = matchMediaMock;
  shallow(<Grid size={{ width: 800, height: 600 }} layouts={layouts} />);
});
