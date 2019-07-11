import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';

import About from './About.component';

jest.mock('./About.messages', () => {
  return {
    about: {
      id: 'cboard.components.About.about',
      defaultMessage: 'About'
    },
    intro: {
      id: 'cboard.components.About.intro',
      defaultMessage:
        'Cboard is an augmentative and alternative communication (AAC) web application, allowing people with speech and language impairments to communicate by symbols and text-to-speech.'
    },
    contributors: {
      id: 'cboard.components.About.contributors',
      defaultMessage: 'Contributors'
    },
    license: {
      id: 'cboard.components.About.license',
      defaultMessage: 'License'
    },
    resources: {
      id: 'cboard.components.About.resources',
      defaultMessage: 'Resources'
    }
  };
});

describe('About tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<About history={{ goBack: () => {} }} />);
  });
});
