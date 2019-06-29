
export async function login(email, password) {

  const userData = {
    authToken: "eyJhbGciOiJIUzcCI6IkpXVCJ9-Pifi0ZUKqyGcjTSLDV0UoPKUY99bo",
    birthdate: "2018-10-23T22:47:09.367Z",
    boards: [{}],
    communicators: [{}],
    email: "anything@cboard.io",
    id: "5bcfa4ed494b20000f8ab98b",
    lastlogin: "2018-10-23T22:47:09.367Z",
    locale: "en-US",
    name: "martin bedouret"
  };
  if (email === 'error') {
    return new Error({ message: 'not found' });
  }
  return userData;
}
const mockBoard = {
  name: 'tewt',
  id: '123',
  tiles: [{ id: '1234', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};

const mockComm = {
    "id": "cboard_default",
    "name": "Cboard's Communicator",
    "description": "Cboard's default communicator",
    "author": "Cboard Team",
    "email": "support@cboard.io",
    "rootBoard": "root",
    "boards": ["root"]
  };

export async function getMyBoards({
  page = 1,
  limit = 10,
  offset = 0,
  sort = '-_id',
  search = ''
} = {}) {
  return mockBoard;
}

export async function createBoard(board) {
  if (board === 'error') {
    return new Error({ message: 'not found' });
  }
  return mockBoard;
}

export async function updateApiBoard(board) {
  return mockBoard;
} 

export async function deleteBoard(boardId) {
  return mockBoard;
}

export async function arasaacPictogramsSearch(locale, searchText) {
  return [];
}

export async function tawasolPictogramsSearch(locale, searchText) {
  return [];
}

export async function oAuthLogin(type, query) {
  return {};
}

export async function getBoards({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
} = {}) {
  return mockBoard;
}

export async function getCommunicators({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
  } = {}) {
    return [ mockComm ];
  }

export async function getBoard(id) {
  return mockBoard;
  }

export async function updateSettings(newSettings = {}) {
return {};
  }


export async function createCommunicator(communicator) {
  return mockComm;
  }

export async function updateCommunicator(communicator) {
  return mockComm;
  }
