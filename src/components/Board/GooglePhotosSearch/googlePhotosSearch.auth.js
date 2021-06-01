const auth = require('google-auth-library');

const GOOGLE_APP_ID = process.env.GOOGLE_APP_ID || null;
const GOOGLE_APP_SECRET = process.env.GOOGLE_APP_SECRET || null;
const oauth2client = new auth.OAuth2Client(
  GOOGLE_APP_ID,
  GOOGLE_APP_SECRET,
  'http://127.0.0.1:3000/'
);

export async function GphotosConnect() {
  const authUrl = oauth2client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/photoslibrary.readonly'
  });
  // redirect user to authUrl and wait for them coming back to callback_uri
  window.location = authUrl;
}

export async function getAuthtoken(code) {
  // in callback_uri handler, get the auth code from query string and obtain a token:
  const tokenResponse = await oauth2client.getToken(code);
  //oauth2client.setCredentials(tokenResponse.tokens);
  return tokenResponse;
}
