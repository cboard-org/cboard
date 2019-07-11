import * as ac from '../Activate.actions';
import mockAxios from 'jest-mock-axios';
import { API_URL } from '../../../../constants';

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

describe('Activate actions', () => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      href: 'https://app.cboard.io',
      origin: 'https://app.cboard.io'
    },
    writable: true
  });
  it('fetches results from get language  api', () => {
    const url = 'asdf';

    let catchFn = jest.fn(),
      thenFn = jest.fn();

    //call method
    ac.activate(url)
      .then(thenFn)
      .catch(catchFn);
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${API_URL}/user/activate/${url}`
    );
    // simulating a server response
    let responseObj = { data: 'activated!' };
    mockAxios.mockResponse(responseObj);
  });
});
