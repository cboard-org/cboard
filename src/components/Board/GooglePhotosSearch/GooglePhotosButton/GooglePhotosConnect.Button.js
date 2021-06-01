/*this button is created using Google Photos UXguidelines https://developers.google.com/photos/library/guides/ux-guidelines*/
import googlePhotosIcon from './Google_Photos_icon.svg';
import { createButton, createSvgIcon } from 'react-social-login-buttons';

const config = {
  text: 'Connect to Google Photos',
  icon: createSvgIcon(googlePhotosIcon), //the icon is not working
  iconFormat: name => `fa fa-${name}`,
  style: { background: '#FFFFFF', color: '#3C4043' },
  activeStyle: { color: 'black' }
};

const ConnectToGooglePhotosButton = createButton(config);

export default ConnectToGooglePhotosButton;
