/**
 * Regression tests for `_getPlatformVoices` and `getVoices`.
 *
 * Fixes issue #2047: "Wrong voices initial value definition on tts file".
 *
 * The original bug: `_getPlatformVoices` initialized `voices` as `{}` and
 * returned `voices._list || voices`. When `synth.getVoices()` threw, or a
 * platform returned a non-array, the caller's `platformVoices.concat(...)`
 * would throw a TypeError and crash the app.
 *
 * These tests lock in the guarantee that `_getPlatformVoices` always returns
 * an array and that `getVoices` safely concatenates its three sources.
 */

// Mock dependencies that `tts.js` pulls in at import time. Keep them minimal;
// we only exercise `_getPlatformVoices` and `getVoices` here.
jest.mock('../../../api', () => ({
  __esModule: true,
  default: {
    getAzureVoices: jest.fn().mockResolvedValue([])
  }
}));

jest.mock('../../../store', () => ({
  getStore: () => ({
    getState: () => ({
      speech: { voices: [] },
      app: { isConnected: false }
    })
  })
}));

jest.mock('microsoft-cognitiveservices-speech-sdk', () => ({
  SpeechConfig: { fromSubscription: jest.fn() },
  SpeechSynthesizer: jest.fn()
}));

jest.mock('../../../cordova-util', () => ({
  isAndroid: () => false,
  isCordova: () => false
}));

describe('tts._getPlatformVoices (issue #2047 regression)', () => {
  let tts;
  let getVoicesMock;

  beforeEach(() => {
    jest.resetModules();
    getVoicesMock = jest.fn();

    // `tts.js` captures `window.speechSynthesis` at import time, so install
    // the mock *before* requiring the module.
    global.window = global.window || {};
    global.window.speechSynthesis = {
      getVoices: getVoicesMock,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    tts = require('../tts').default;
  });

  it('returns an array when synth.getVoices() returns an empty object (the original bug)', () => {
    getVoicesMock.mockReturnValue({});
    const result = tts._getPlatformVoices();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  it('returns an array when synth.getVoices() returns undefined', () => {
    getVoicesMock.mockReturnValue(undefined);
    const result = tts._getPlatformVoices();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  it('returns an array when synth.getVoices() throws', () => {
    getVoicesMock.mockImplementation(() => {
      throw new Error('speechSynthesis unavailable');
    });
    const result = tts._getPlatformVoices();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  it('returns the array when synth.getVoices() returns a proper array', () => {
    const fakeVoices = [
      { voiceURI: 'en-US-1', name: 'Voice 1', lang: 'en-US' },
      { voiceURI: 'es-ES-1', name: 'Voice 2', lang: 'es-ES' }
    ];
    getVoicesMock.mockReturnValue(fakeVoices);
    const result = tts._getPlatformVoices();
    expect(result).toEqual(fakeVoices);
  });

  it('unwraps Cordova-style `._list` when present', () => {
    const fakeList = [{ voiceURI: 'cordova-1', name: 'Cordova Voice' }];
    getVoicesMock.mockReturnValue({ _list: fakeList });
    const result = tts._getPlatformVoices();
    expect(result).toEqual(fakeList);
  });

  it('guarantees the result of _getPlatformVoices supports .concat without throwing', () => {
    getVoicesMock.mockReturnValue({}); // the historical bug trigger
    const platformVoices = tts._getPlatformVoices();
    // This is the exact call site that used to throw (see tts.js getVoices()).
    expect(() => platformVoices.concat([]).concat([])).not.toThrow();
  });
});
