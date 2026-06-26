import { AppContainer } from '../App.container';

jest.mock('../App.component', () => () => null);

describe('AppContainer.handleDataRefresh', () => {
  const buildInstance = (props = {}) => {
    const instance = new AppContainer();
    instance.props = {
      isLogged: true,
      hasPendingSyncBoards: false,
      getApiObjects: jest.fn(() => Promise.resolve()),
      ...props
    };
    return instance;
  };

  const originalOnLine = window.navigator.onLine;

  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      configurable: true
    });
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: originalOnLine,
      configurable: true
    });
    jest.restoreAllMocks();
  });

  it('dispatches a sync when pending boards bypass the throttle', () => {
    const getApiObjects = jest.fn(() => Promise.resolve());
    const instance = buildInstance({
      hasPendingSyncBoards: true,
      getApiObjects
    });

    instance.handleDataRefresh('App started');

    expect(getApiObjects).toHaveBeenCalledTimes(1);
  });

  it('skips sync when throttled and no boards are pending', () => {
    const getApiObjects = jest.fn(() => Promise.resolve());
    const instance = buildInstance({
      hasPendingSyncBoards: false,
      getApiObjects
    });
    instance.lastSyncTime = Date.now();

    instance.handleDataRefresh('Tab focused');

    expect(getApiObjects).not.toHaveBeenCalled();
  });

  it('skips sync when offline', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      configurable: true
    });
    const getApiObjects = jest.fn();
    const instance = buildInstance({ getApiObjects });

    instance.handleDataRefresh('App started');

    expect(getApiObjects).not.toHaveBeenCalled();
  });

  it('skips sync when not logged in', () => {
    const getApiObjects = jest.fn();
    const instance = buildInstance({ isLogged: false, getApiObjects });

    instance.handleDataRefresh('App started');

    expect(getApiObjects).not.toHaveBeenCalled();
  });
});
