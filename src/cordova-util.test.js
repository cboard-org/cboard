import {
  isAndroid,
  isCordova,
  isElectron,
  isIOS,
  isPackagedApp
} from './cordova-util';

// These five predicates are called from about 45 files. The tests pin that
// they are evaluated at call time (window.cordova is set by the wrapper after
// the bundle loads) and which globals each one depends on.
describe('cordova-util platform predicates', () => {
  const originalLocation = window.location;

  let locationReplaced = false;

  // jsdom cannot navigate to another scheme, so the location object is
  // replaced. This works on the jsdom that Jest 27 ships; newer jsdom makes
  // window.location non-configurable. The assertion makes that upgrade fail
  // here, with a clear cause, instead of in the predicates below.
  const setProtocol = (protocol) => {
    delete window.location;
    window.location = { protocol };
    locationReplaced = true;
    expect(window.location.protocol).toBe(protocol);
  };

  afterEach(() => {
    delete window.cordova;
    if (locationReplaced) {
      window.location = originalLocation;
      locationReplaced = false;
    }
  });

  it('reports a plain browser when there is no cordova global', () => {
    expect(isCordova()).toBe(false);
    expect(isElectron()).toBe(false);
    expect(isIOS()).toBe(false);
    expect(isAndroid()).toBe(false);
    expect(isPackagedApp()).toBe(false);
  });

  it('reads window.cordova when called, not when imported', () => {
    expect(isCordova()).toBe(false);

    window.cordova = { platformId: 'ios' };
    expect(isCordova()).toBe(true);
    expect(isIOS()).toBe(true);
    expect(isElectron()).toBe(false);

    window.cordova = { platformId: 'electron' };
    expect(isElectron()).toBe(true);
    expect(isIOS()).toBe(false);
  });

  it('treats any scheme other than http and https as a packaged app', () => {
    setProtocol('https:');
    expect(isPackagedApp()).toBe(false);

    setProtocol('file:');
    expect(isPackagedApp()).toBe(true);

    setProtocol('app:');
    expect(isPackagedApp()).toBe(true);
  });

  it('requires both a packaged scheme and the android platform id for isAndroid', () => {
    window.cordova = { platformId: 'android' };
    expect(isAndroid()).toBe(false);

    setProtocol('file:');
    expect(isAndroid()).toBe(true);

    window.cordova = { platformId: 'ios' };
    expect(isAndroid()).toBe(false);

    delete window.cordova;
    expect(isAndroid()).toBe(false);
  });
});
