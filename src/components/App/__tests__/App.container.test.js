import { AppContainer, resetSyncThrottle } from '../App.container';

jest.mock('../App.component', () => () => null);

describe('AppContainer.handleDataRefresh', () => {
  const buildInstance = (props = {}) => {
    const instance = new AppContainer();
    instance.props = {
      isLogged: true,
      getApiObjects: jest.fn(() => Promise.resolve()),
      ...props
    };
    return instance;
  };

  const originalOnLine = window.navigator.onLine;

  beforeEach(() => {
    resetSyncThrottle();
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

  it('dispatches a sync when the throttle window has not started', () => {
    const getApiObjects = jest.fn(() => Promise.resolve());
    const instance = buildInstance({ getApiObjects });

    instance.handleDataRefresh('App started');

    expect(getApiObjects).toHaveBeenCalledTimes(1);
  });

  it('skips sync when throttled', () => {
    const getApiObjects = jest.fn(() => Promise.resolve());
    const instance = buildInstance({ getApiObjects });

    instance.handleDataRefresh('App started');
    instance.handleDataRefresh('Tab focused');

    expect(getApiObjects).toHaveBeenCalledTimes(1);
  });

  it('keeps the throttle across a remount (new instance)', () => {
    const getApiObjects = jest.fn(() => Promise.resolve());
    const firstMount = buildInstance({ getApiObjects });
    firstMount.handleDataRefresh('App started');

    const secondMount = buildInstance({ getApiObjects });
    secondMount.handleDataRefresh('App started');

    expect(getApiObjects).toHaveBeenCalledTimes(1);
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
