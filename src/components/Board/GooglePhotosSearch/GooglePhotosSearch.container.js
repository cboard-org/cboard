import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl /*, intlShape */ } from 'react-intl';

import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
//import Button from '@material-ui/core/Button';
import ConnectToGooglePhotosButton from './GooglePhotosButton/GooglePhotosConnect.Button';

import { GphotosConnect, getAuthtoken } from './googlePhotosSearch.auth';
import { getAlbums } from './GooglePhotosSearch.axios';
import { Paper } from '@material-ui/core';

export class GooglePhotosSearch extends PureComponent {
  state = {
    isGPhotosConnected: false,
    isConnetingToGPhotos: false
  };

  static propTypes = {
    //intl: intlShape.isRequired,
    open: PropTypes.bool,
    //maxSuggestions: PropTypes.number,
    //onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    googlePhotosCode: PropTypes.string
  };

  static defaultProps = {
    open: false
    //maxSuggestions: 16
  };

  connectToGPhotos = () => {
    this.setState({
      isConnetingToGPhotos: true
    });

    GphotosConnect();
  };

  getAuthtoken = async code => {
    this.authToken = await getAuthtoken(code);
    this.gotAlbums();
  };

  gotAlbums = () => {
    getAlbums(this.authToken.tokens.access_token.toString());
  };

  render() {
    const { open, onClose, googlePhotosCode } = this.props;
    return (
      <div>
        <FullScreenDialog
          open={open}
          buttons={null}
          transition="fade"
          onClose={onClose}
        >
          <Paper>
            <FullScreenDialogContent>
              {googlePhotosCode ? (
                this.getAuthtoken(googlePhotosCode)
              ) : (
                <ConnectToGooglePhotosButton onClick={this.connectToGPhotos} />
              )}
              {/* <FilterBar
                  options={this.state.symbolSets}
                  onChange={this.handleChangeOption}
                  /> */}
            </FullScreenDialogContent>
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

export default injectIntl(GooglePhotosSearch);
