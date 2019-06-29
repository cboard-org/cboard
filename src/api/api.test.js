
import API from './api';
import mockAxios from 'jest-mock-axios';

const mockBoard = {
  name: 'tewt',
  id: '123',
  tiles: [{ id: '1234', loadBoard: '456456456456456456456' }],
  isPublic: false,
  email: 'asd@qwe.com',
  markToUpdate: true
};

describe('Cboard API calls', () => {
  let initialState;
  // set up a fake store for all our tests
  beforeEach(() => {
  });
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });

  it("fetches results from get language  api",  () => {
    let catchFn = jest.fn(), thenFn = jest.fn();

    //call method
    API.getLanguage('es-ES')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it("fetches results from get my boards api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();

    //call method
    API.getMyBoards(1, 10)
      .then(thenFn)
      .catch(catchFn);
  });
  it("fetches results from get boards api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();

    //call method
    API.getBoards(1)
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it("fetches results from get board api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();

    //call method
    API.getBoard('aaaa')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it("fetches results from get communicators api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();

    //call method
    API.getCommunicators(1,10)
      .then(thenFn)
      .catch(catchFn);
  });
  it("fetches results from createBoard  api",  () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    const board = {
      "name": "board_name",
      "author": "Postman Test",
      "email": "email@qwe.com",
      "format": "obf",
      "tiles": [
        {}
      ],
      "caption": "string",
      "isPublic": true,
      "locale": "ar-SA"
    }
    //call method
    API.createBoard(mockBoard)
        .then(data => { expect(data).toEqual(mockBoard) });
    });
  });
  it("fetches results from createCommunicator  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    const comm = {
      "name": "comm_name",
      "author": "Postman Test",
      "email": "email@qwe.com",
      "rootBoard": "obf",
      "boards": [
        {}
      ]
    };
    //call method
    API.createCommunicator(comm)
      .then(thenFn)
      .catch(catchFn);
  });
  it("fetches results from arasaacPictogramsSearch  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.arasaacPictogramsSearch('es','perro')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it("fetches results from deleteBoard  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.deleteBoard('esnm')
      .then(thenFn)
      .catch(catchFn);
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
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
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
  it("fetches results from uploadFromDataURL  api", () => {
    let catchFn = jest.fn(), thenFn = jest.fn();
    //call method
    API.uploadFromDataURL('es', 'perro')
      .then(thenFn)
      .catch(catchFn);
  });
