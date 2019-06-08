import React from 'react';
import { shallow } from 'enzyme';
import { LanguageProvider } from '../LanguageProvider.container';

it('renders without crashing', () => {
  const props = {
    lang: '',
    setLangs: () => {},
    changeLang: () => {}
  };
  shallow(
    <LanguageProvider {...props}>
      <div />
    </LanguageProvider>
  );
});
