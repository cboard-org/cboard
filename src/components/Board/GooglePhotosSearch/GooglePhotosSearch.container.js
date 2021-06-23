import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl /*, intlShape */ } from 'react-intl';

import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import ConnectToGooglePhotosButton from './GooglePhotosButton';
import Alert from '@material-ui/lab/Alert';

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

import { GphotosConnect } from './googlePhotosSearch.auth';
import { getAlbums, getAlbumContent } from './GooglePhotosSearch.axios';
import { Paper } from '@material-ui/core';

import API from '../../../api';
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
    view: 'albums',
    loading: false,
    error: null
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

  authTokenVerify = async () => {
    const { googlePhotosCode, googlePhotosAuth } = this.props;
    try {
      const currentTime = new Date().getTime() - 10 * 1000;
      if (googlePhotosCode && !googlePhotosAuth) {
        this.logInGooglePhotos({ googlePhotosCode });
      } else if (googlePhotosAuth?.expiry_date - currentTime < 0) {
        this.logInGooglePhotos({
          refreshToken: googlePhotosAuth?.refresh_token
        });
      } else if (googlePhotosAuth) this.gotAlbums();
    } catch (error) {
      console.log('logInGooglePhotosAuth error:', error);
      this.setState({
        error: error
      });
    }
  };

  logInGooglePhotos(params) {
    const { logInGooglePhotosAuth } = this.props;

    logInGooglePhotosAuth(params).then(
      () => {
        this.setState({
          error: null
        });
        this.gotAlbums(); //because Albums is default view
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  }

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

  handlePhotoSelected = async (imageData) => {
    const { onChange, onClose, user} = this.props;
    //this.setState({ value: '' });
    // Loggedin user?
    if (user) {
      this.setState({
        loading: true
      });
      try {
        const imageUrl = await API.uploadFromUrlOnApi(imageData);
        onChange(imageUrl);
        console.log('imageUrl', imageUrl);
        onClose();
        return
      }catch(error){
        console.log(error);
        return
      } 
    }
    console.log('you need to be loged on cboard to upload photos from Gooogle Photos')   
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
    this.setState({
      albumsList: null,
      loading: true
    });

    this.authTokenVerify();
  };

  render() {
    const { open, onClose, googlePhotosAuth, logOutGooglePhotos } = this.props;
    const { albumData, albumsList, loading, error, view } = this.state;
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
              {error && (
                <Alert severity="error">
                  Sorry an error ocurred. Try it again
                </Alert>
              )}
              {googlePhotosAuth ? (
                <>
                  <BottomNavigation
                    value={view}
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
                  {view === 'albums' ? (
                    <div className={null}>
                      {albumData ? (
                        <>
                          <GooglePhotosSearchGallery
                            imagesData={albumData}
                            onSelect={this.handlePhotoSelected}
                          />
                          <Fab
                            onClick={this.onBackGallery}
                            color="primary"
                            aria-label="back"
                          >
                            <ArrowBackIosIcon />
                          </Fab>
                        </>
                      ) : (
                        albumsList !== null && (
                          <List>{this.renderAlbumsList()}</List>
                        )
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
    googlePhotosAuth: googlePhotosAuth,
    user: userData.email ? userData : null
  };
};

const mapDispatchToProps = { logInGooglePhotosAuth, logOutGooglePhotos };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(GooglePhotosSearch));
