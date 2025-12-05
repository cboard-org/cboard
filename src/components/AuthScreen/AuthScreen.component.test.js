import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowMatchSnapshot } from '../../common/test_utils';
import AuthScreen from './AuthScreen.component';

jest.mock('./AuthScreen.messages', () => {
  return {
    login: {
      id: 'cboard.components.WelcomeScreen.login',
      defaultMessage: 'Login'
    },
    signUp: {
      id: 'cboard.components.WelcomeScreen.signUp',
      defaultMessage: 'Sign Up'
    },
    facebook: {
      id: 'cboard.components.WelcomeScreen.facebook',
      defaultMessage: 'Sign in with Facebook'
    },
    google: {
      id: 'cboard.components.WelcomeScreen.google',
      defaultMessage: 'Sign in with Google'
    },
    skipForNow: {
      id: 'cboard.components.WelcomeScreen.skipForNow',
      defaultMessage: 'Skip for now'
    },
    heading: {
      id: 'cboard.components.AuthScreenInformation.heading',
      defaultMessage: 'Cboard'
    },
    text: {
      id: 'cboard.components.AuthScreenInformation.text',
      defaultMessage: 'Sign up to sync your settings!'
    }
  };
});

// Mock WelcomeScreen to test onClose behavior
jest.mock('../WelcomeScreen', () => {
  return function MockWelcomeScreen({ onClose }) {
    return (
      <div data-testid="welcome-screen">
        <button data-testid="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  };
});

describe('AuthScreen tests', () => {
  const mockIntl = {
    formatMessage: jest.fn(({ id }) => id)
  };

  test('default renderer', () => {
    const mockHistory = { goBack: jest.fn(), push: jest.fn() };
    shallowMatchSnapshot(<AuthScreen history={mockHistory} intl={mockIntl} />);
  });

  describe('Close button behavior', () => {
    test('should call history.goBack() when history.action is PUSH', () => {
      const mockGoBack = jest.fn();
      const mockPush = jest.fn();
      const mockHistory = {
        action: 'PUSH',
        goBack: mockGoBack,
        push: mockPush
      };

      const wrapper = mount(
        <AuthScreen history={mockHistory} intl={mockIntl} />
      );

      // Find and click the close button
      const closeButton = wrapper.find('[data-testid="close-button"]');
      closeButton.simulate('click');

      // Should call goBack, not push
      expect(mockGoBack).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
    });

    test('should redirect to /board/root when history.action is not PUSH (no browsing history)', () => {
      const mockGoBack = jest.fn();
      const mockPush = jest.fn();
      const mockHistory = {
        action: 'POP', // or 'REPLACE' - any non-PUSH action
        goBack: mockGoBack,
        push: mockPush
      };

      const wrapper = mount(
        <AuthScreen history={mockHistory} intl={mockIntl} />
      );

      // Find and click the close button
      const closeButton = wrapper.find('[data-testid="close-button"]');
      closeButton.simulate('click');

      // Should call push with /board/root, not goBack
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/board/root');
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    test('should redirect to /board/root when history.action is undefined (new user, no history)', () => {
      const mockGoBack = jest.fn();
      const mockPush = jest.fn();
      const mockHistory = {
        action: undefined, // No history action
        goBack: mockGoBack,
        push: mockPush
      };

      const wrapper = mount(
        <AuthScreen history={mockHistory} intl={mockIntl} />
      );

      // Find and click the close button
      const closeButton = wrapper.find('[data-testid="close-button"]');
      closeButton.simulate('click');

      // Should call push with /board/root
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/board/root');
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    test('should redirect to /board/root when history.action is REPLACE', () => {
      const mockGoBack = jest.fn();
      const mockPush = jest.fn();
      const mockHistory = {
        action: 'REPLACE',
        goBack: mockGoBack,
        push: mockPush
      };

      const wrapper = mount(
        <AuthScreen history={mockHistory} intl={mockIntl} />
      );

      const closeButton = wrapper.find('[data-testid="close-button"]');
      closeButton.simulate('click');

      expect(mockPush).toHaveBeenCalledWith('/board/root');
      expect(mockGoBack).not.toHaveBeenCalled();
    });
  });

  describe('Integration with WelcomeScreen', () => {
    test('should pass onClose handler to WelcomeScreen', () => {
      const mockHistory = {
        action: 'POP',
        goBack: jest.fn(),
        push: jest.fn()
      };

      const wrapper = mount(
        <AuthScreen history={mockHistory} intl={mockIntl} />
      );

      // Verify WelcomeScreen receives onClose prop
      const welcomeScreen = wrapper.find('[data-testid="welcome-screen"]');
      expect(welcomeScreen.exists()).toBe(true);
    });
  });
});
