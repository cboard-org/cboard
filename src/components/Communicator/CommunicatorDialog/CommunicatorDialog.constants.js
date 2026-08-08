// Legacy tab indexes — still used by CommunicatorDialogTour to key its
// per-section walkthrough flows (mapped from SECTIONS via SECTION_TO_TAB).
export const TAB_INDEXES = {
  COMMUNICATOR_BOARDS: 0,
  PUBLIC_BOARDS: 1,
  MY_BOARDS: 2
};

// Dashboard sections (replaces the tabs). Each section maps the data source it
// reads from and the set of board actions it exposes.
export const SECTIONS = {
  MY_BOARDS: 'myBoards',
  MY_COMMUNICATOR: 'myCommunicator',
  COMMUNITY: 'community'
};

export const SECTION_ORDER = [
  SECTIONS.MY_BOARDS,
  SECTIONS.MY_COMMUNICATOR,
  SECTIONS.COMMUNITY
];

// Maps each dashboard section to its legacy tab index so the existing data
// fetching / business logic (keyed by TAB_INDEXES) keeps working unchanged.
export const SECTION_TO_TAB = {
  [SECTIONS.MY_COMMUNICATOR]: TAB_INDEXES.COMMUNICATOR_BOARDS,
  [SECTIONS.MY_BOARDS]: TAB_INDEXES.MY_BOARDS,
  [SECTIONS.COMMUNITY]: TAB_INDEXES.PUBLIC_BOARDS
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const VIEW_MODE_STORAGE_KEY = 'cboard-communicator-view-mode';

export const NAV_COLLAPSED_STORAGE_KEY = 'cboard-communicator-nav-collapsed';

export const BOARDS_PAGE_LIMIT = 12;
