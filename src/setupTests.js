import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

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
  { voiceURI: "Google Deutsch", lang: "de-DE", name: "Google Deutsch" },
  { voiceURI: "Google US English", lang: "en-US", name: "Google US English" },
  { voiceURI: "Google UK English Female", lang: "en-GB", name: "Google UK English Female" },
  { voiceURI: "Google UK English Male", lang: "en-GB", name: "Google UK English Male" },
  { voiceURI: "Google español", lang: "es-ES", name: "Google español" }
];
const getVoices = () => {
  return voices;
}
const cancel = jest.fn();

Object.defineProperty(window.speechSynthesis, 'getVoices', {
  value: getVoices
});
Object.defineProperty(window.speechSynthesis, 'cancel', {
  value: cancel
});

//location
Object.defineProperty(window, 'location', {
  value: {
    hash: "",
    host: "app.cboard.io",
    hostname: "app.cboard.io",
    href: "https://app.cboard.io",
    origin: "https://app.cboard.io",
    pathname: "",
    port: "",
    protocol: "https:",
    reload: jest.fn(),
    replace: jest.fn(),
    search: ""
  },
  writable: true
});
