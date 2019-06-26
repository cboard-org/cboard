
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
