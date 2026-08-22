import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CommunicatorDialog from './CommunicatorDialog.component';
import { SECTIONS } from './CommunicatorDialog.constants';

// react-intl is auto-mocked, so the real messages module resolves to undefined.
// Provide a proxy that returns a descriptor for any key the component reads.
jest.mock('./CommunicatorDialog.messages', () => ({
  __esModule: true,
  default: new Proxy(
    {},
    {
      get: (target, prop) => ({
        id: String(prop),
        defaultMessage: String(prop)
      })
    }
  )
}));

const intlMock = {
  formatMessage: ({ defaultMessage }) => defaultMessage
};

const mockCommunicator = {
  id: 'comm-1',
  name: 'My Communicator',
  rootBoard: 'board-1',
  boards: ['board-1', 'board-2']
};

const buildProps = (overrides = {}) => ({
  open: true,
  intl: intlMock,
  onClose: jest.fn(),
  userData: { authToken: 'token', name: 'Tester', email: 'tester@cboard.io' },
  language: { lang: 'en-US' },
  communicators: [mockCommunicator],
  currentCommunicator: mockCommunicator,
  communicatorBoards: [],
  availableBoards: [],
  activeBoardId: 'board-1',
  communicatorTour: {},
  isSymbolSearchTourEnabled: false,
  createBoard: jest.fn(),
  updateBoard: jest.fn(),
  replaceBoard: jest.fn(),
  addBoards: jest.fn(),
  deleteBoard: jest.fn(),
  deleteApiBoard: jest.fn(),
  updateApiBoard: jest.fn(),
  updateApiObjectsNoChild: jest.fn(),
  addBoardCommunicator: jest.fn(),
  verifyAndUpsertCommunicator: jest.fn(),
  upsertApiCommunicator: jest.fn(),
  showNotification: jest.fn(),
  disableTour: jest.fn(),
  switchBoard: jest.fn(),
  ...overrides
});

describe('CommunicatorDialog (dashboard)', () => {
  test('renders the dashboard shell', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('renders the navigation and section header', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    expect(wrapper.find('DashboardNav').length).toBe(1);
    expect(wrapper.find('SectionHeader').length).toBe(1);
  });

  test('starts on the My Boards section', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    expect(wrapper.find('DashboardNav').prop('section')).toBe(
      SECTIONS.MY_BOARDS
    );
  });

  test('renders the quick access tray on My Communicator', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    wrapper.find('DashboardNav').prop('onChange')(SECTIONS.MY_COMMUNICATOR);
    expect(wrapper.find('QuickAccessTray').length).toBe(1);
    expect(wrapper.find('BoardsView').length).toBe(0);
  });

  test('renders the boards view and details surface on the default section', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    expect(wrapper.find('BoardsView').length).toBe(1);
    expect(wrapper.find('BoardDetailsSurface').length).toBe(1);
  });

  test('renders a live region', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    expect(wrapper.find('LiveRegion').length).toBe(1);
  });

  test('hides search and the view toggle on quick access', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    expect(wrapper.find('ContentToolbar').length).toBe(1);

    wrapper.find('DashboardNav').prop('onChange')(SECTIONS.MY_COMMUNICATOR);
    expect(wrapper.find('ContentToolbar').length).toBe(0);
  });

  test('switching section updates the active section', () => {
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);
    wrapper.find('DashboardNav').prop('onChange')(SECTIONS.COMMUNITY);
    expect(wrapper.find('DashboardNav').prop('section')).toBe(
      SECTIONS.COMMUNITY
    );
    expect(wrapper.find('SectionHeader').prop('section')).toBe(
      SECTIONS.COMMUNITY
    );
  });

  test('drops a pending search when the section changes', () => {
    jest.useFakeTimers();
    const wrapper = shallow(<CommunicatorDialog {...buildProps()} />);

    wrapper.find('ContentToolbar').prop('onSearchChange')('abc');
    wrapper.find('DashboardNav').prop('onChange')(SECTIONS.COMMUNITY);

    jest.advanceTimersByTime(1000);
    wrapper.update();

    expect(wrapper.find('ContentToolbar').prop('search')).toBe('');
    expect(wrapper.find('BoardsView').prop('hasSearch')).toBe(false);
    jest.useRealTimers();
  });
});
