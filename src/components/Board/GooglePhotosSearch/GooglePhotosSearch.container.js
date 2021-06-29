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
import VisibilityIcon from '@material-ui/icons/Visibility';

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

import { Button, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import API from '../../../api';
import { connect } from 'react-redux';
import {
  logInGooglePhotosAuth,
  logOutGooglePhotos
} from '../../App/App.actions';

import GooglePhotosFilter from './GooglePhotosFilter/googlePhotosFilter.component';

export class GooglePhotosSearch extends PureComponent {
  state = {
    isGPhotosConnected: false,
    albumsList: null,
    albumData: null,
    filterData: null,
    recentData: null,
    view: 'albums',
    loading: false,
    error: null
    // pageMananger: {  // to add te ability for manage pages after download more than one
    //   pagesStored: 0,
    //   page: 0
    // }
  };

  static propTypes = {
    //intl: intlShape.isRequired,
    open: PropTypes.bool,
    //maxSuggestions: PropTypes.number,
    //onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    googlePhotosCode: PropTypes.string,
    onExchangeCode: PropTypes.func,
    googlePhotosAuth: PropTypes.object,
    logInGooglePhotosAuth: PropTypes.func
  };

  static defaultProps = {
    open: false,
    googlePhotosCode: null
  };

  connectToGPhotos = () => {
    GphotosConnect();
  };

  logOutGooglePhotosBtn = () => {
    const { logOutGooglePhotos, onExchangeCode } = this.props;
    logOutGooglePhotos();
    onExchangeCode();
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
    this.setState({
      error: null,
      loading: true
    });
    try {
      const albumsList = await getAlbums(
        this.props.googlePhotosAuth.access_token.toString()
      );
      this.setState({
        loading: false,
        albumsList: albumsList
      });
    } catch (error) {
      console.log('getAlbums error:', error);
      this.setState({
        loading: false,
        error: error
      });
    }
  };

  handleBottomNavChange = (e, value) => {
    this.setState({
      view: value,
      loading: false,
      error: null,
      albumData: null,
      filterData: null,
      recentData: null
    });
    if (value === 'recent') this.handleRecentClick();
  };

  handleFilterSearch = async filters => {
    this.setState({
      loading: true,
      error: null
    });

    let params = {
      token: this.props.googlePhotosAuth.access_token.toString(),
      filters: filters
    };

    try {
      const filterData = await getAlbumContent(params);

      if (this.state.view !== 'search') return;

      if (filterData.nextPageToken) filterData.filters = filters;

      this.setState({
        filterData: filterData,
        loading: false
      });
    } catch (error) {
      console.log('filter search error:', error);
      this.setState({
        error: error,
        loading: false
      });
    }
  };

  handleFilterSearchNextPage = async () => {
    const { filterData } = this.state;
    const filters = filterData.filters;

    this.setState({
      loading: true,
      error: null
    });

    let params = {
      token: this.props.googlePhotosAuth.access_token.toString(),
      filters: filters,
      nextPage: filterData.nextPageToken
    };

    try {
      const filterData = await getAlbumContent(params);

      if (this.state.view !== 'search') return;

      if (filterData.nextPageToken) filterData.filters = filters;

      this.setState({
        filterData: filterData,
        loading: false
      });
    } catch (error) {
      console.log('filter search error:', error);
      this.setState({
        error: error,
        loading: false
      });
    }
  };

  /*TO DO  add the posibility tu return to before page later*/
  // managePages = (nextPage) => {
  //   const {pageMananger} = this.state;
  //   if(nextPage){
  //     if(pageMananger.page + 1 >= pageMananger.pagesStored) return this.handleAlbumItemClick({getNextPage: true})
  //     this.sliceAlbumData()
  //   }

  // }

  // sliceAlbumData = () => {
  //   const {albumData, pageMananger} = this.state;
  //   const PAGE_SIZE = 26
  //   const pageContent = albumData.mediaItems.slice(pageMananger.page, pageMananger.page + PAGE_SIZE)
  //   return pageContent;
  // }

  handleAlbumItemClick = async albumItemData => {
    let params = {
      token: this.props.googlePhotosAuth.access_token.toString(),
      id: albumItemData.albumId?.toString()
    };
    this.setState({
      loading: true,
      error: null
    });
    try {
      const albumData = await getAlbumContent(params);

      if (this.state.view !== 'albums') return;

      if (albumData.nextPageToken) albumData.albumId = albumItemData.albumId;
      this.setState({
        albumData: albumData,
        loading: false
      });
    } catch (error) {
      console.log('getAlbumContent error:', error);
      this.setState({
        error: error,
        loading: false
      });
    }
  };

  handleAlbumNextPage = async () => {
    const { albumData } = this.state;
    const albumId = albumData.albumId;

    this.setState({
      loading: true,
      error: null
    });

    let params = {
      token: this.props.googlePhotosAuth.access_token.toString(),
      id: albumId,
      nextPage: albumData.nextPageToken
    };

    try {
      const albumData = await getAlbumContent(params);

      if (this.state.view !== 'albums') return;

      if (albumData.nextPageToken) albumData.albumId = albumId;

      this.setState({
        albumData: albumData,
        loading: false
      });
    } catch (error) {
      console.log('album Next page error:', error);
      this.setState({
        error: error,
        loading: false
      });
    }
  };

  handleRecentClick = async (nextPage = false) => {
    this.setState({
      loading: true,
      error: null
    });

    const params = {
      token: this.props.googlePhotosAuth.access_token.toString()
    };

    if (nextPage) params.nextPage = this.state.recentData?.nextPageToken;

    try {
      const recentData = await getAlbumContent(params);
      if (this.state.view !== 'recent') return;

      this.setState({
        recentData: recentData,
        loading: false
      });
    } catch (error) {
      console.log('recent data error:', error);
      this.setState({
        error: error,
        loading: false
      });
    }
  };

  onBackGallery = () => {
    this.setState({
      albumData: null,
      filterData: null
    });
  };

  handlePhotoSelected = async imageData => {
    const { onChange, onClose, user } = this.props;
    // Loggedin user?
    if (user) {
      this.setState({
        error: null,
        loading: true
      });
      try {
        const imageUrl = await API.uploadFromUrlOnApi(imageData);
        onChange(imageUrl);
        this.setState({
          loading: false
        });
        onClose();
        return;
      } catch (error) {
        this.setState({
          error: error,
          loading: false
        });
        console.log(error);
        return;
      }
    }
    console.log(
      'you need to be loged on cboard to upload photos from Gooogle Photos'
    );
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({
      albumData: null,
      filterData: null
    });
    onClose();
  };

  renderAlbumsList = () => {
    return this.state.albumsList.albums.map(el => {
      return (
        <ListItem
          button
          onClick={() => this.handleAlbumItemClick({ albumId: el.id })}
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
    const { open, googlePhotosCode, googlePhotosAuth } = this.props;
    const {
      albumData,
      filterData,
      recentData,
      albumsList,
      loading,
      error,
      view
    } = this.state;
    const buttons = (
      <button
        //label={intl.formatMessage(messages.symbolSearch)}
        onClick={this.logOutGooglePhotosBtn}
      >
        Logout
      </button>
    );
    return (
      <div>
        <FullScreenDialog
          open={open}
          buttons={googlePhotosAuth ? buttons : null}
          transition="fade"
          onClose={this.handleClose}
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
                    <BottomNavigationAction
                      label="Recent"
                      value="recent"
                      icon={<VisibilityIcon />}
                    />
                  </BottomNavigation>
                  {view === 'search' && (
                    <GooglePhotosFilter
                      filterSearch={this.handleFilterSearch}
                    />
                  )}
                  {loading ? (
                    <div>
                      <CircularProgress size={40} thickness={7} />
                    </div>
                  ) : (
                    <div className={null}>
                      {albumData?.mediaItems ||
                      filterData?.mediaItems ||
                      recentData?.mediaItems ? (
                        <>
                          <GooglePhotosSearchGallery
                            imagesData={
                              view === 'albums'
                                ? albumData.mediaItems
                                : view === 'search'
                                ? filterData.mediaItems
                                : recentData.mediaItems
                            }
                            onSelect={this.handlePhotoSelected}
                          />
                          {(albumData?.nextPageToken ||
                            filterData?.nextPageToken ||
                            recentData?.nextPageToken) && (
                            <Button
                              onClick={
                                view === 'albums'
                                  ? this.handleAlbumNextPage
                                  : view === 'search'
                                  ? this.handleFilterSearchNextPage
                                  : () => this.handleRecentClick(true)
                              }
                            >
                              nextPage
                            </Button>
                          )}
                          {view === 'albums' && (
                            <Fab
                              onClick={this.onBackGallery}
                              color="primary"
                              aria-label="back"
                            >
                              <ArrowBackIosIcon />
                            </Fab>
                          )}
                        </>
                      ) : (
                        <>
                          {view === 'albums' && (
                            <>
                              <div>
                                {albumsList !== null && (
                                  <List>{this.renderAlbumsList()}</List>
                                )}
                              </div>
                            </>
                          )}
                          {(view === 'recent' ||
                            (view === 'albums' && !albumsList)) &&
                            error && (
                              <div>
                                <Button
                                  onClick={
                                    view === 'albums'
                                      ? this.gotAlbums
                                      : this.handleRecentClick
                                  }
                                >
                                  try Again
                                </Button>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {googlePhotosCode ? (
                    <CircularProgress size={40} thickness={7} />
                  ) : (
                    <ConnectToGooglePhotosButton
                      onClick={this.connectToGPhotos}
                    />
                  )}
                </>
              )}
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
