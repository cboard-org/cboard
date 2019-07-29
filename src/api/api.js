import axios from 'axios';
import {
  API_URL,
  ARASAAC_BASE_PATH_API,
  TAWASOL_BASE_PATH_API
} from '../constants';
import { getStore } from '../store';
import { dataURLtoFile } from '../helpers';

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

  async getLanguage(lang) {
    try {
      const { status, data } = await this.axiosInstance.get(
        `/languages/${lang}`
      );
      if (status === 200) return data;
      return null;
    } catch (err) {
      return null;
    }
  }

  async arasaacPictogramsSearch(locale, searchText) {
    const pictogSearchTextPath = `${ARASAAC_BASE_PATH_API}pictograms/${locale}/search/${searchText}`;
    try {
      const { status, data } = await this.axiosInstance.get(
        pictogSearchTextPath
      );
      if (status === 200) return data;
      return [];
    } catch (err) {
      return [];
    }
  }

  async tawasolPictogramsSearch(locale, searchText) {
    const pictogSearchTextPath = `${TAWASOL_BASE_PATH_API}symbol/${searchText}`;
    try {
      const { status, data } = await this.axiosInstance.get(
        pictogSearchTextPath
      );
      if (status === 200) return data;
      return [];
    } catch (err) {
      return [];
    }
  }

  async login(email, password) {
    const { data } = await this.axiosInstance.post('/user/login', {
      email,
      password
    });

    return data;
  }

  async oAuthLogin(type, query) {
    const { data } = await this.axiosInstance.get(
      `/login/${type}/callback${query}`
    );
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

  async getCommunicators({
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
    const url = `/communicator/byemail/${email}?${query}`;

    const { data } = await this.axiosInstance.get(url, { headers });
    return data;
  }

  async getBoard(id) {
    const { data } = await this.axiosInstance.get(`/board/${id}`);
    return data;
  }

  async updateSettings(newSettings = {}) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { settings } = getUserData() || {};

    const updatedSettings = { ...settings, ...newSettings };

    const { data } = await this.axiosInstance.post(
      `/settings`,
      updatedSettings,
      {
        headers
      }
    );

    return data;
  }

  async updateUser(user) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };
  
    const { data } = await this.axiosInstance.put(
      `/user/${user.id}`,
      user,
      {
        headers
      }
    );

    return data;
  }

  async createBoard(board) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }
    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.post(`/board`, board, {
      headers
    });
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

  async deleteBoard(boardId) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.delete(`/board/${boardId}`, {
      headers
    });

    return data;
  }


  async uploadFromDataURL(dataURL, filename, checkExtension = false) {
    const file = dataURLtoFile(dataURL, filename, checkExtension);

    let url = null;
    try {
      url = await this.uploadFile(file, filename);
    } catch (e) {}

    return url;
  }

  async uploadFile(file, filename) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'multipart/form-data'
    };

    const formData = new FormData();
    formData.append('file', file, filename);
    const response = await this.axiosInstance.post('media', formData, {
      headers
    });

    return response.data.url;
  }

  async createCommunicator(communicator) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    let data = {};
    let response = {};
    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const communicatorToPost = { ...communicator };
    delete communicatorToPost.id;
    const { name, email } = getUserData();
    communicatorToPost.email = email;
    communicatorToPost.author = name;
    response = await this.axiosInstance.post(
      `/communicator`,
      communicatorToPost,
      { headers }
    );
    data = response.data.communicator;
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

const API_INSTANCE = new API({});

export default API_INSTANCE;
