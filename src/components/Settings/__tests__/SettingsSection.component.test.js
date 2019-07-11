import React from 'react';
import { shallow, mount } from 'enzyme';

import SettingsSection from '../SettingsSection.component';

it('renders without crashing', () => {
  const props = {
    settings: [{ url: 'www' }, { url: 'vvv' }]
  };
  const wrapper = shallow(<SettingsSection {...props} />);
  expect(wrapper).toMatchSnapshot();
});
