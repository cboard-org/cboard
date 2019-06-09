import React from 'react';
import { shallow } from 'enzyme';

import SettingsSection from '../SettingsSection.component';

it('renders without crashing', () => {
  shallow(<SettingsSection />);
});
