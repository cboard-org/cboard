
import API from './api';
import mockAxios from 'jest-mock-axios';

jest.mock('../store');

const mockBoard = {
  name: 'tewt',
  id: '12345678901234567',
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

describe('Cboard API calls', () => {
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });

  it("fetches results from get language  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.getLanguage('es-ES')
      .then(thenFn)
      .catch(catchFn);
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it("fetches results from get my boards api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.getMyBoards(1, 10)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it("fetches results from get boards api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.getBoards()
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it("fetches results from get board api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.getBoard(mockBoard.id)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it("fetches results from get communicators api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.getCommunicators()
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockComm);
  });
  it("fetches results from createBoard api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.createBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it("fetches results from createCommunicator  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.createCommunicator(mockComm)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockComm);
  });
  it("fetches results from arasaacPictogramsSearch  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.arasaacPictogramsSearch('es', 'perro')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it("fetches results from deleteBoard  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.deleteBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it("fetches results from login  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    const user = {
      "email": "email@qwe.com",
      "password": "123456"
    }
    //call method
    API.login(user)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(user);
  });
  it("fetches results from tawasolPictogramsSearch  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.tawasolPictogramsSearch('es', 'perro')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it("fetches results from updateBoard api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.updateBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
});
