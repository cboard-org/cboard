import axios from 'axios';
import history from '../history';
import { alpha2ToAlpha3T } from '@cospired/i18n-iso-languages';
import {
  API_URL,
  ARASAAC_BASE_PATH_API,
  GLOBALSYMBOLS_BASE_PATH_API,
  AZURE_VOICES_BASE_PATH_API,
  AZURE_SPEECH_SUBSCR_KEY
} from '../constants';
import { getStore } from '../store';
import {
  convertMediaUrlToCDN,
  dataURLtoBlob,
  isDataURL,
  isLocalFileURL
} from '../helpers';
import { logout } from '../components/Account/Login/Login.actions.js';
import { isAndroid } from '../cordova-util';

const BASE_URL = API_URL;
const LOCAL_COMMUNICATOR_ID = 'cboard_default';
export let improvePhraseAbortController;

const getUserData = () => {
  const store = getStore();
  const {
    app: { userData }
  } = store.getState();

  return userData;
};

const getSubscriberId = () => {
  const store = getStore();
  const {
    subscription: { subscriberId }
  } = store.getState();
  return subscriberId;
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
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (
          error.response?.status === 403 &&
          error.config?.baseURL === BASE_URL
        ) {
          if (isAndroid()) {
            window.FirebasePlugin.unregister();
            window.facebookConnectPlugin.logout(
              function(msg) {
                console.log('disconnect facebook msg' + msg);
              },
              function(msg) {
                console.log('error facebook disconnect msg' + msg);
              }
            );
          }
          getStore().dispatch(logout());
          history.push('/login-signup/');
        }
        return Promise.reject(error);
      }
    );
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

  async getAzureVoices() {
    const azureVoicesListPath = `${AZURE_VOICES_BASE_PATH_API}list`;
    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_SPEECH_SUBSCR_KEY
    };
    try {
      const { status, data } = await this.axiosInstance.get(
        azureVoicesListPath,
        { headers }
      );
      if (status === 200) return data;
      return [];
    } catch (err) {
      console.error(err.message);
      return [];
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
  async arasaacPictogramsGetImageUrl(pictogGetTextPath) {
    try {
      const { status, data } = await this.axiosInstance.get(pictogGetTextPath);
      if (status === 200) return data.image;
      return '';
    } catch (err) {
      return '';
    }
  }

  async globalsymbolsPictogramsSearch(locale, searchText) {
    let language = 'eng';
    if (locale.length === 3) {
      language = locale;
    }
    if (locale.length === 2) {
      language = alpha2ToAlpha3T(locale);
    }
    const pictogSearchTextPath = `${GLOBALSYMBOLS_BASE_PATH_API}labels/search/?query=${searchText}&language=${language}&language_iso_format=639-3&limit=20`;
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

  async forgot(email) {
    const { data } = await this.axiosInstance.post('/user/forgot', {
      email
    });

    return data;
  }

  async storePassword(userid, password, url) {
    const { data } = await this.axiosInstance.post('/user/store-password', {
      userid: userid,
      token: url,
      password: password
    });

    return data;
  }

  async oAuthLogin(type, query) {
    if (type === 'apple' || type === 'apple-web') {
      const authCode = query?.substring(1);
      const { data } = await this.axiosInstance.post(
        `/login/${type}/callback`,
        {
          state: 'cordova',
          code: authCode
        }
      );
      return data;
    }
    const { data } = await this.axiosInstance.get(
      `/login/${type}/callback${query}`
    );
    return data;
  }

  async getUserData(userId) {
    const authToken = getAuthToken();
    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.get(`/user/${userId}`, {
      headers
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

  async getPublicBoards({
    page = 1,
    limit = 10,
    offset = 0,
    sort = '-_id',
    search = ''
  } = {}) {
    const query = getQueryParameters({ page, limit, offset, sort, search });
    const url = `/board/public?${query}`;
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

  // Fetch the full bodies of a specific set of boards in a single request.
  // POST (not GET) because the id list can be large enough to blow past URL
  // length limits on a fresh-device sync.
  async getBoardsByIds(ids = []) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.post(
      `/board/byids`,
      { ids },
      { headers }
    );
    return data;
  }

  async getBoardsSync() {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const { email } = getUserData();
    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.get(`/board/sync/${email}`, {
      headers
    });
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

  async getCbuilderBoard(id) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request', {
        cause: 401
      });
    }
    const headers = {
      Authorization: `Bearer ${authToken}`
    };
    const { data } = await this.axiosInstance.get(`/board/cbuilder/${id}`, {
      headers
    });
    return data;
  }

  async getSettings() {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.get(`/settings`, { headers });
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

    const { data } = await this.axiosInstance.post(`/settings`, newSettings, {
      headers
    });

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

    const { data } = await this.axiosInstance.put(`/user/${user.id}`, user, {
      headers
    });

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

  async boardReport(reportedBoardData) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.post(
      `/board/report`,
      reportedBoardData,
      { headers }
    );
    return data;
  }

  async uploadFromDataURL(dataURL, filename, checkExtension = false) {
    let url = null;
    try {
      const blob = dataURLtoBlob(dataURL);
      let name = filename;
      if (checkExtension) {
        const extension = (blob.type.split('/')[1] || 'png').toLowerCase();
        name = `${filename}.${extension}`;
      }
      url = await this.uploadFile(blob, name);
    } catch (e) {}

    return url;
  }

  async uploadTileImageMedia(tile) {
    if (isDataURL(tile.image)) {
      const url = await this.uploadFromDataURL(tile.image, tile.id, true);
      return { attempted: true, url };
    }

    if (isLocalFileURL(tile.image) && isAndroid()) {
      const file = await new Promise(resolve => {
        window.resolveLocalFileSystemURL(
          tile.image,
          fileEntry => {
            fileEntry.file(file => resolve(file), () => resolve(null));
          },
          () => resolve(null)
        );
      });
      if (file) {
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });
        const realBlob = new Blob([arrayBuffer], {
          type: file.type || 'image/png'
        });
        const segments = tile.image.split('/');
        const name = segments[segments.length - 1] || tile.id;
        const url = await this.uploadFile(realBlob, name);
        return { attempted: true, url };
      }
      return { attempted: true, url: null };
    }

    return { attempted: false, url: null };
  }

  async uploadTileSoundMedia(tile) {
    if (isDataURL(tile.sound)) {
      const url = await this.uploadFromDataURL(tile.sound, `${tile.id}.mp3`);
      return { attempted: true, url };
    }

    return { attempted: false, url: null };
  }

  async uploadBoardLocalMedia(board) {
    const tiles = board?.tiles || [];
    const targets = tiles.filter(
      tile =>
        isDataURL(tile?.image) ||
        isLocalFileURL(tile?.image) ||
        isDataURL(tile?.sound)
    );

    if (!targets.length) {
      return { board, hadFailure: false };
    }

    const imageUrlByTileId = {};
    const soundUrlByTileId = {};
    let hadFailure = false;

    const uploadTarget = async tile => {
      try {
        const [image, sound] = await Promise.all([
          this.uploadTileImageMedia(tile),
          this.uploadTileSoundMedia(tile)
        ]);

        if (image.attempted) {
          if (image.url) {
            imageUrlByTileId[tile.id] = image.url;
          } else {
            hadFailure = true;
          }
        }

        if (sound.attempted) {
          if (sound.url) {
            soundUrlByTileId[tile.id] = sound.url;
          } else {
            hadFailure = true;
          }
        }
      } catch (e) {
        hadFailure = true;
      }
    };

    const CONCURRENCY = 5;
    for (let i = 0; i < targets.length; i += CONCURRENCY) {
      await Promise.all(targets.slice(i, i + CONCURRENCY).map(uploadTarget));
    }

    const sanitizedBoard = {
      ...board,
      tiles: tiles.map(tile => {
        const imageUrl = imageUrlByTileId[(tile?.id)];
        const soundUrl = soundUrlByTileId[(tile?.id)];
        if (!imageUrl && !soundUrl) {
          return tile;
        }
        return {
          ...tile,
          ...(imageUrl ? { image: imageUrl } : {}),
          ...(soundUrl ? { sound: soundUrl } : {})
        };
      })
    };

    return { board: sanitizedBoard, hadFailure };
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

    const url = response.data.url;
    return (url && convertMediaUrlToCDN(url)) || url;
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

  async analyticsReport(report) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }
    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    const { data } = await this.axiosInstance.post(
      `/analytics/batchGet`,
      report,
      {
        headers
      }
    );
    return data;
  }

  async getUserLocation() {
    const { data } = await this.axiosInstance.get(`/location`);
    return data;
  }

  async getSubscriber(userId = getUserData().id, requestOrigin = 'unknown') {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }
    const headers = {
      Authorization: `Bearer ${authToken}`,
      requestOrigin,
      purchaseVersion: '1.0.0'
    };
    const { data } = await this.axiosInstance.get(`/subscriber/${userId}`, {
      headers
    });

    if (data && !data.success) {
      throw data;
    }

    return data;
  }

  async createSubscriber(subscriber = {}) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };
    const { data } = await this.axiosInstance.post(`/subscriber`, subscriber, {
      headers
    });
    return data;
  }

  async cancelPlan(subscriptionId = '') {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }
    const data = { reason: 'User cancelled the subscription' };

    const headers = {
      Authorization: `Bearer ${authToken}`
    };
    const res = await this.axiosInstance.post(
      `/subscriber/cancel/${subscriptionId}`,
      { data },
      { headers }
    );
    return res;
  }

  async postTransaction(transaction = {}) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };
    const subscriberId = getSubscriberId();
    if (!subscriberId) throw new Error('No subscriber id supplied');

    const { data } = await this.axiosInstance.post(
      `/subscriber/${subscriberId}/transaction`,
      transaction,
      {
        headers
      }
    );
    return data;
  }

  async updateSubscriber(subscriber = {}) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    const headers = {
      Authorization: `Bearer ${authToken}`
    };
    const subscriberId = getSubscriberId();
    if (!subscriberId) throw new Error('No subscriber id supplied');

    const { data } = await this.axiosInstance.patch(
      `/subscriber/${subscriberId}`,
      subscriber,
      {
        headers
      }
    );
    return data;
  }

  async listSubscriptions() {
    const { data } = await this.axiosInstance.get(`/subscription/list`);
    return data;
  }

  async deleteAccount() {
    const userId = getUserData().id;
    if (userId) {
      const authToken = getAuthToken();
      if (!(authToken && authToken.length)) {
        throw new Error('Need to be authenticated to perform this request');
      }

      const headers = {
        Authorization: `Bearer ${authToken}`
      };
      const { data } = await this.axiosInstance.delete(`/account/${userId}`, {
        headers
      });
      return data;
    }
  }

  async improvePhrase({ phrase, language }) {
    const authToken = getAuthToken();
    if (!(authToken && authToken.length)) {
      throw new Error('Need to be authenticated to perform this request');
    }

    try {
      const headers = {
        Authorization: `Bearer ${authToken}`
      };
      improvePhraseAbortController = new AbortController();
      const { data } = await this.axiosInstance.post(
        `/gpt/edit`,
        { phrase, language },
        {
          headers,
          signal: improvePhraseAbortController.signal
        }
      );
      return data;
    } catch (error) {
      if (error.message !== 'canceled') console.error(error);
      return { phrase: '' };
    }
  }
}

const API_INSTANCE = new API({});

export default API_INSTANCE;
