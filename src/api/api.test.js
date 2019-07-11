import API from './api';
import mockAxios from 'jest-mock-axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import { getStore } from '../store';

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
  id: 'cboard_default',
  name: "Cboard's Communicator",
  description: "Cboard's default communicator",
  author: 'Cboard Team',
  email: 'support@cboard.io',
  rootBoard: 'root',
  boards: ['root']
};

describe('Cboard API calls', () => {
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });

  it('fetches results from get language  api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.getLanguage('es-ES')
      .then(thenFn)
      .catch(catchFn);
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it('fetches results from get language api error', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.getLanguage('es-ES')
      .then(thenFn)
      .catch(catchFn);
    let responseObj = { status: 500, data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it('fetches results from get my boards api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.getMyBoards(1, 10)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it('fetches results from get boards api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.getBoards()
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it('fetches results from get board api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.getBoard(mockBoard.id)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it('fetches results from get communicators api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.getCommunicators()
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockComm);
  });
  it('fetches results from updateSettings api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.updateSettings()
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockComm);
  });
  it('fetches results from createBoard api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.createBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it('fetches results from createCommunicator  api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.createCommunicator(mockComm)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockComm);
  });
  it('fetches results from arasaacPictogramsSearch api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.arasaacPictogramsSearch('es', 'perro')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it('fetches results from arasaacPictogramsSearch api error', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.arasaacPictogramsSearch('es', 'perro')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { status: 500, data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it('fetches results from deleteBoard  api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.deleteBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it('fetches results from login  api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    const user = {
      email: 'email@qwe.com',
      password: '123456'
    };
    //call method
    API.login(user)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(user);
  });
  it('fetches results from tawasolPictogramsSearch api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.tawasolPictogramsSearch('es', 'perro')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it('fetches results from tawasolPictogramsSearch api error', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.tawasolPictogramsSearch('es', 'perro')
      .then(thenFn)
      .catch(catchFn);
    // simulating a server response
    let responseObj = { status: 500, data: 'fake!' };
    mockAxios.mockResponse(responseObj);
  });
  it('fetches results from updateBoard api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.updateBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it('fetches results from updateCommunicator api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    API.updateCommunicator(mockComm)
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockComm);
  });
  it('fetches results from uploadFromDataURL api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    //call method
    const dataUrl = 'data:text/plain;charset=utf-8;base64,dGVzdGluZw==';
    API.uploadFromDataURL(dataUrl, 'test.txt')
      .then(thenFn)
      .catch(catchFn);
    mockAxios.mockResponse(mockBoard);
  });
  it('fetches results from unauthorized api', () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();
    const store = getStore();
    store.getState().app.userData = null;

    //call method
    API.getMyBoards()
      .then(thenFn)
      .catch(catchFn);
    //call method
    API.updateBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    //call method
    API.createBoard(mockBoard)
      .then(thenFn)
      .catch(catchFn);
    //call method
    API.deleteBoard('1234')
      .then(thenFn)
      .catch(catchFn);
    //call method
    API.getCommunicators()
      .then(thenFn)
      .catch(catchFn);
    //call method
    API.updateSettings()
      .then(thenFn)
      .catch(catchFn);
    //call method
    API.updateCommunicator(mockComm)
      .then(thenFn)
      .catch(catchFn);
    //call method
    API.createCommunicator(mockComm)
      .then(thenFn)
      .catch(catchFn);
    const dataUrl = 'data:text/plain;charset=utf-8;base64,dGVzdGluZw==';
    API.uploadFromDataURL(dataUrl, 'test.txt')
      .then(thenFn)
      .catch(catchFn);
  });
});
