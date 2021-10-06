/*this button is created using Google Photos UXguidelines https://developers.google.com/photos/library/guides/ux-guidelines*/
import React from 'react';
import './GooglePhotosConnect.Button.css';
import { injectIntl } from 'react-intl';
import messages from './../GooglePhotosSearch.messages';

export default injectIntl(function ConnectToGooglePhotosButton(props) {
  return (
    <div className="customBtn">
      <span className="icon" />
      <span className="buttonText">
        {props.intl.formatMessage(messages.addFrom)}
        <br />
        Google Photos
      </span>
    </div>
  );
});
