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

// Each section has its own walkthrough. The flags are persisted per user, so
// they keep the names they had when the sections were tabs.
export const SECTION_TOUR_FLAGS = {
  [SECTIONS.MY_BOARDS]: 'isAllMyBoardsEnabled',
  [SECTIONS.MY_COMMUNICATOR]: 'isCommBoardsEnabled',
  [SECTIONS.COMMUNITY]: 'isPublicBoardsEnabled'
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const VIEW_MODE_STORAGE_KEY = 'cboard-communicator-view-mode';

export const NAV_COLLAPSED_STORAGE_KEY = 'cboard-communicator-nav-collapsed';

export const BOARDS_PAGE_LIMIT = 12;
