import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Stream } from 'stream';

configure({ adapter: new Adapter() });

//window global object
global.window = Object.create(window);

//speech synthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {},
  writable: true
});

global.window.speechSynthesis = Object.create(speechSynthesis);
let voices = [
  { voiceURI: 'Google Deutsch', lang: 'de-DE', name: 'Google Deutsch' },
  { voiceURI: 'Google US English', lang: 'en-US', name: 'Google US English' },
  {
    voiceURI: 'Google UK English Female',
    lang: 'en-GB',
    name: 'Google UK English Female'
  },
  {
    voiceURI: 'Google UK English Male',
    lang: 'en-GB',
    name: 'Google UK English Male'
  },
  { voiceURI: 'Google español', lang: 'es-ES', name: 'Google español' }
];
const getVoices = () => {
  return voices;
};
const cancel = jest.fn();
const load = jest.fn();
const onvoiceschanged = jest.fn();

Object.defineProperty(window.speechSynthesis, 'getVoices', {
  value: getVoices
});
Object.defineProperty(window.speechSynthesis, 'cancel', {
  value: cancel
});
Object.defineProperty(window.speechSynthesis, 'onvoiceschanged', {
  value: onvoiceschanged
});
Object.defineProperty(window, 'load', {
  value: load
});
window.MediaRecorder = Object.defineProperty(window, 'MediaRecorder', {
  value: () => {
    return Object.create({});
  },
  writable: true
});

//location
Object.defineProperty(window, 'location', {
  value: {
    hash: '',
    host: 'app.cboard.io',
    hostname: 'app.cboard.io',
    href: 'https://app.cboard.io',
    origin: 'https://app.cboard.io',
    pathname: '',
    port: '',
    protocol: 'https:',
    reload: jest.fn(),
    replace: jest.fn(),
    search: ''
  },
  writable: true
});

//navigator
global.navigator = Object.create(navigator);
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    controller: {
      scriptURL: 'https://app.cboard.io/service-worker.js',
      state: 'activated',
      onerror: jest.fn(),
      onstatechange: jest.fn()
    },
    oncontrollerchange: jest.fn(),
    onmessage: jest.fn(),
    ready: jest.fn()
  },
  writable: true
});
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: () => {
      return new Promise((resolve, reject) => {
        resolve(new Stream());
      });
    },
    ondevicechange: jest.fn(),
    onmessage: jest.fn(),
    ready: jest.fn()
  },
  writable: true
});
