import React from 'react';
import { shallow } from 'enzyme';
import { LanguageProvider } from './LanguageProvider';

it('renders without crashing', () => {
  shallow(
    <LanguageProvider locale={'en'}>
      <div />
    </LanguageProvider>
  );
});
