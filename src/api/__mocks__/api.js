const mockBoard = {
  name: 'tewt',
  id: '12345678901234567',
  tiles: [{ id: '1234567890123456', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};

const mockComm = {
  id: 'cboard_default',
  name: "Cboard's Communicator",
  description: "Cboard's default communicator",
  author: 'Cboard Team',
  email: 'support@cboard.io',
  rootBoard: 'root',
  boards: ['root']
};

const userData = {
  authToken: 'eyJhbGciOiJIUzcCI6IkpXVCJ9-Pifi0ZUKqyGcjTSLDV0UoPKUY99bo',
  birthdate: '2018-10-23T22:47:09.367Z',
  boards: [{}],
  communicators: [
    {
      author: 'martin bedouret',
      boards: ['5cd5af199f55b200154cab25', '5beedf1694ec83000fe79c68'],
      description: "Cboard's default communicator",
      email: 'anything@cboard.io',
      id: '5beedb9a94ec83000fe79c67',
      name: "Cboard's Communicator",
      rootBoard: '5c1d33d6ed721600157addb1'
    }
  ],
  email: 'anything@cboard.io',
  id: '5bcfa4ed494b20000f8ab98b',
  lastlogin: '2018-10-23T22:47:09.367Z',
  locale: 'en-US',
  name: 'martin bedouret',
  settings: {
    speech: {
      lang: 'en-GB',
      voiceURI:
        'urn:moz-tts:sapi:Microsoft Hazel Desktop - English (Great Britain)?en-GB'
    }
  }
};

class API {
  login(email, password) {
    return new Promise((resolve, reject) => {
      if (email === 'error') {
        reject(new Error({ message: 'not found' }));
      } else {
        resolve(userData);
      }
    });
  }

  getMyBoards({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
  }) {
    return new Promise((resolve, reject) => {
      if (search === 'error') {
        reject(new Error({ message: 'not found' }));
      } else {
        resolve(mockBoard);
      }
    });
  }

  createBoard(board) {
    return new Promise((resolve, reject) => {
      if (board.hasOwnProperty('error')) {
        reject(new Error({ message: 'not found' }));
      } else {
        resolve(mockBoard);
      }
    });
  }

  updateBoard(board) {
    return new Promise((resolve, reject) => {
      if (board.hasOwnProperty('error')) {
        reject(new Error({ message: 'not found' }));
      } else {
        resolve(mockBoard);
      }
    });
  }

  deleteBoard(boardId) {
    return new Promise((resolve, reject) => {
      if (boardId === 'error') {
        reject(new Error({ message: 'not found' }));
      } else {
        resolve(mockBoard);
      }
    });
  }

  uploadFile(file, filename) {
    return new Promise((resolve, reject) => {
      if (file === 'error') {
        reject(new Error({ message: 'not found' }));
      } else {
        resolve('test');
      }
    });
  }
  async arasaacPictogramsSearch(locale, searchText) {
    return [];
  }

  oAuthLogin(type, query) {
    return new Promise((resolve, reject) => {
      if (email === 'error') {
        reject(new Error({ message: 'not found' }));
      } else {
        resolve(userData);
      }
    });
  }

  async getBoards({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
  } = {}) {
    return mockBoard;
  }

  async getCommunicators({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
  } = {}) {
    return [mockComm];
  }

  async getBoard(id) {
    return mockBoard;
  }

  async updateSettings(newSettings = {}) {
    return {};
  }

  async createCommunicator(communicator) {
    return mockComm;
  }

  async updateCommunicator(communicator) {
    return mockComm;
  }
}

const API_INSTANCE = new API({});

export default API_INSTANCE;
