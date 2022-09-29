import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import People from './People.component';

jest.mock('./People.messages', () => {
  return {
    people: {
      id: 'cboard.components.Settings.People.people',
      defaultMessage: 'People'
    },
    name: {
      id: 'cboard.components.Settings.People.name',
      defaultMessage: 'Name'
    },
    nameSecondary: {
      id: 'cboard.components.Settings.People.nameSecondary',
      defaultMessage: 'Update your user name'
    },
    email: {
      id: 'cboard.components.Settings.People.email',
      defaultMessage: 'Email'
    },
    emailSecondary: {
      id: 'cboard.components.Settings.People.emailSecondary',
      defaultMessage: 'Update your user email'
    },
    language: {
      id: 'cboard.components.Settings.People.language',
      defaultMessage: 'Language'
    },
    languageSecondary: {
      id: 'cboard.components.Settings.People.languageSecondary',
      defaultMessage: 'Let us know what is your language'
    },
    birthdate: {
      id: 'cboard.components.Settings.People.birthdate',
      defaultMessage: 'Birth Date'
    },
    birthdateSecondary: {
      id: 'cboard.components.Settings.People.birthdateSecondary',
      defaultMessage: 'Update your birth date'
    },
    location: {
      id: 'cboard.components.Settings.People.location',
      defaultMessage: 'Location'
    },
    logout: {
      id: 'cboard.components.Settings.People.logout',
      defaultMessage: 'Logout'
    }
  };
});

describe('People tests', () => {
  const onChangePeople = jest.fn();
  const onSubmitPeople = jest.fn();
  const onClose = jest.fn();
  const logout = jest.fn();
  test('default renderer', () => {
    shallowMatchSnapshot(
      <People
        isLogged={false}
        onClose={onClose}
        onChangePeople={onChangePeople}
        onSubmitPeople={onSubmitPeople}
        logout={logout}
      />
    );
  });
});
