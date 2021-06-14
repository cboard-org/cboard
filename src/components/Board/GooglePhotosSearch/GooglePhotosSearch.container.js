import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl /*, intlShape */ } from 'react-intl';

import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import ConnectToGooglePhotosButton from './GooglePhotosButton';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import PhotoAlbumRoundedIcon from '@material-ui/icons/PhotoAlbumRounded';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import GooglePhotosSearchGallery from './GooglePhotosSearchGallery';
import Fab from '@material-ui/core/Fab';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { GphotosConnect, getAuthtoken } from './googlePhotosSearch.auth';
import { getAlbums, getAlbumContent } from './GooglePhotosSearch.axios';
import { Paper } from '@material-ui/core';

import { connect } from 'react-redux';
import {
  logInGooglePhotosAuth,
  logOutGooglePhotos
} from '../../App/App.actions';

export class GooglePhotosSearch extends PureComponent {
  state = {
    isGPhotosConnected: false,
    isConnetingToGPhotos: false,
    albumsList: null,
    view: 'albums'
  };

  static propTypes = {
    //intl: intlShape.isRequired,
    open: PropTypes.bool,
    //maxSuggestions: PropTypes.number,
    //onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    googlePhotosCode: PropTypes.string,
    googlePhotosAuth: PropTypes.object,
    logInGooglePhotosAuth: PropTypes.func
  };

  static defaultProps = {
    open: false,
    googlePhotosCode: null
  };

  connectToGPhotos = () => {
    this.setState({
      isConnetingToGPhotos: true
    });

    GphotosConnect();
  };

  gotAlbums = async () => {
    const albumsList = await getAlbums(
      this.props.googlePhotosAuth.access_token.toString()
    );
    this.setState({
      albumsList: albumsList
    });
  };

  handleBottomNavChange = (e, value) => {
    this.setState({
      view: value
    });
  };

  handleAlbumItemClick = async (e, albumId) => {
    const albumData = await getAlbumContent(
      this.props.googlePhotosAuth.access_token.toString(),
      albumId.toString()
    );
    this.setState({
      albumData: albumData
    });
  };

  onBackGallery = () => {
    this.setState({
      albumData: null
    });
  };

  renderAlbumsList = () => {
    return this.state.albumsList.albums.map(el => {
      return (
        <ListItem
          button
          onClick={event => this.handleAlbumItemClick(event, el.id)}
          key={el.id}
        >
          <ListItemAvatar>
            <Avatar src={el.coverPhotoBaseUrl} />
          </ListItemAvatar>
          <ListItemText primary={el.title} />
        </ListItem>
      );
    });
  };

  componentDidMount = async () => {
    const { logInGooglePhotosAuth } = this.props;
    if (this.props.googlePhotosCode && !this.props.googlePhotosAuth) {
      const authToken = await getAuthtoken(this.props.googlePhotosCode);
      logInGooglePhotosAuth(authToken.tokens);
    }
    if (this.props.googlePhotosAuth) await this.gotAlbums(); //by default get data for albums view
  };

  render() {
    const { open, onClose, googlePhotosAuth, logOutGooglePhotos } = this.props;
    const buttons = (
      <button
        //label={intl.formatMessage(messages.symbolSearch)}
        onClick={logOutGooglePhotos}
      >
        Logout
      </button>
    );
    return (
      <div>
        <FullScreenDialog
          open={open}
          buttons={buttons}
          transition="fade"
          onClose={onClose}
          fullWidth={true}
        >
          <Paper>
            <FullScreenDialogContent>
              {googlePhotosAuth ? (
                <>
                  <BottomNavigation
                    value={this.state.view}
                    onChange={this.handleBottomNavChange}
                    showLabels
                    //className={classes.root}
                  >
                    <BottomNavigationAction
                      label="Albums"
                      value="albums"
                      icon={<PhotoAlbumRoundedIcon />}
                    />
                    <BottomNavigationAction
                      label="Search"
                      value="search"
                      icon={<ImageSearchIcon />}
                    />
                  </BottomNavigation>
                  {this.state.view === 'albums' ? (
                    <div className={null}>
                      {this.state.albumData ? (
                        <>
                          <GooglePhotosSearchGallery
                            imagesData={this.state.albumData}
                          />
                          <Fab
                            onClick={this.onBackGallery}
                            color="primary"
                            aria-label="back"
                          >
                            <ArrowBackIosIcon />
                          </Fab>
                        </>
                      ) : this.state.albumsList === null ? (
                        <>{this.gotAlbums()}</>
                      ) : (
                        <List>{this.renderAlbumsList()}</List>
                      )}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <ConnectToGooglePhotosButton
                    onClick={this.connectToGPhotos}
                  />
                </>
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

const mapStateToProps = ({ app: { userData } }) => {
  const googlePhotosAuth = userData.googlePhotosAuth;
  return {
    googlePhotosAuth: googlePhotosAuth
  };
};

const mapDispatchToProps = { logInGooglePhotosAuth, logOutGooglePhotos };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(GooglePhotosSearch));
