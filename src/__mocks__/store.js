
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let initialState;
  initialState = {
    app: {
      userData: {
        authToken: "eyJhbGciOiJIUtI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFybCI6ImFueXRoaW5nQGNib2FyZC5pbyIsImlkIjoiNWJjZmE0ZWQ0OTRiMjAwMDBmOGFiOThiIiwiaXNzdWVyIjoiY2JvYXJkLmlvIiwiaWF0IjoxNTU5NzU1NTU3fQ.2ENI4GyaHwV1B-Pifi0ZUKqyGcjTSLDV0UoPKUY99bo",
        email: "anything@cboard.io",
        id: "5bcfa4ed494b20000f8ab98b",
        lastlogin: "2018-10-23T22:47:09.367Z",
        locale: "en-US",
        name: "martin bedouret",
        provider: "",
        role: "user"
      }
    }
  };
  const store = mockStore(initialState);

  export const getStore = () => store;
