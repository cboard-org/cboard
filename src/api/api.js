import axios from 'axios';
import { API_URL } from '../constants';
import { getStore } from '../store';

const BASE_URL = API_URL;
const LOCAL_COMMUNICATOR_ID = 'cboard_default';

const getUserData = () => {
  const store = getStore();
  const {
    app: { userData }
  } = store.getState();

  return userData;
};

const getAuthToken = () => {
  const userData = getUserData() || {};
  return userData.authToken || null;
};

const getQueryParameters = (obj = {}) => {
  return Object.keys(obj)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
};

class API {
  constructor(config = {}) {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      ...config
    });
  }

  async login(role, email, password) {
    const { data } = await this.axiosInstance.post(`/user/login/${role}`, {
      email,
      password
    });

    return data;
  }

  async getBoards({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
  } = {}) {
    const query = getQueryParameters({ page, limit, offset, sort, search });
    const url = `/board?${query}`;
    const { data } = await this.axiosInstance.get(url);
    return data;
  }

  async getMyBoards({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
  } = {}) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const { email } = getUserData();
    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const query = getQueryParameters({ page, limit, offset, sort, search });
    const url = `/board/byemail/${email}?${query}`;

    const { data } = await this.axiosInstance.get(url, { headers });
    return data;
  }

  async getBoard(id) {
    const { data } = await this.axiosInstance.get(`/board/${id}`);
    return data;
  }

  async updateBoard(board) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.put(`/board/${board.id}`, board, {
      headers
    });

    return data;
  }

  async updateCommunicator(communicator) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    let data = {};
    let response = {};
    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const isLocalCommunicator =
      communicator.id && communicator.id === LOCAL_COMMUNICATOR_ID;

    if (isLocalCommunicator) {
      const communicatorToPost = { ...communicator };
      delete communicatorToPost.id;
      const { name, email } = getUserData();
      communicatorToPost.name = `Communicator of ${name} <${email}>`;
      communicatorToPost.email = email;
      communicatorToPost.author = name;
      response = await this.axiosInstance.post(
        `/communicator`,
        communicatorToPost,
        { headers }
      );
      data = response.data.communicator;
    } else {
      response = await this.axiosInstance.put(
        `/communicator/${communicator.id}`,
        communicator,
        { headers }
      );
      data = response.data;
    }

    return data;
  }
}

const API_INSTANCE = new API({
  baseURL: 'http://localhost:10010'
});

export default API_INSTANCE;
