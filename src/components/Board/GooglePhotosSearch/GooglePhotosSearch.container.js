import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import messages from './GooglePhotosSearch.messages';

import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
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
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { getAlbums, getContent } from './GooglePhotosSearch.axios';

import { Button, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import API from '../../../api';
import { connect } from 'react-redux';
import {
  logInGooglePhotosAuth,
  logOutGooglePhotos
} from '../../App/App.actions';

import GooglePhotosFilter from './GooglePhotosFilter/GooglePhotosFilter.component';

import './GooglePhotosSearch.css';

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
    intl: intlShape.isRequired,
    open: PropTypes.bool,
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

  logOutGooglePhotosBtn = () => {
    const { logOutGooglePhotos, onExchangeCode } = this.props;
    logOutGooglePhotos();
    onExchangeCode();
    this.props.onClose();
  };

  authTokenVerify = async () => {
    const {
      googlePhotosCode,
      googlePhotosAuth,
      logOutGooglePhotos
    } = this.props;
    try {
      if (googlePhotosCode && !googlePhotosAuth) {
        this.logInGooglePhotos({ googlePhotosCode });
      } else if (googlePhotosAuth) {
        try {
          await this.gotAlbums(true); //check if expired token
        } catch {
          logOutGooglePhotos(); // if expired delete token
        }
      }
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
      async () => {
        this.setState({
          error: null
        });
        await this.gotAlbums(); //because Albums is default view
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  }

  gotAlbums = async (checkIfExpired = false) => {
    this.setState({
      error: null,
      loading: true
    });
    try {
      const albumsList = await getAlbums(
        this.props.googlePhotosAuth?.access_token.toString()
      );
      this.setState({
        loading: false,
        albumsList: albumsList
      });
    } catch (error) {
      if (checkIfExpired) throw new Error(error.message);
      console.log('getAlbums error:', error);
      this.setState({
        loading: false,
        error: error
      });
    }
  };

  handleBottomNavChange = async (e, value) => {
    this.setState({
      view: value,
      loading: false,
      error: null,
      albumData: null,
      filterData: null,
      recentData: null
    });
    if (value === 'recent') await this.handleRecentClick();
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
      const filterData = await getContent(params);

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
      const filterData = await getContent(params);

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
      const albumData = await getContent(params);

      if (this.state.view !== 'albums') return;

      if (albumData.nextPageToken) albumData.albumId = albumItemData.albumId;
      this.setState({
        albumData: albumData,
        loading: false
      });
    } catch (error) {
      console.log('getAlbumContent error:', error);
      this.setState({
        error: error, //here is posible set an AlbumItem flag action in HandleTryAgain
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
      const albumData = await getContent(params);

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
      const recentData = await getContent(params);
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
        const imageUrl = await API.uploadFromUrl(imageData);
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
          onClick={async () =>
            await this.handleAlbumItemClick({ albumId: el.id })
          }
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

    await this.authTokenVerify();
  };

  handletryAgainClick = async view => {
    if (view === 'albums') {
      await this.gotAlbums();
      return;
    }
    await this.handleRecentClick();
  };

  render() {
    const { open, googlePhotosCode, googlePhotosAuth, intl } = this.props;
    const {
      albumData,
      filterData,
      recentData,
      albumsList,
      loading,
      error,
      view
    } = this.state;

    const getViewData = (view, data) => {
      if (view === 'albums') return data.albumData;
      if (view === 'search') return data.filterData;
      if (view === 'recent') return data.recentData;
    };

    const handleNextPageClick = view => {
      if (view === 'albums') return this.handleAlbumNextPage();
      if (view === 'search') return this.handleFilterSearchNextPage();
      if (view === 'recent') return this.handleRecentClick(true);
    };

    const viewData = getViewData(view, {
      albumData,
      filterData,
      recentData
    });

    const buttons = (
      <Button
        variant="contained"
        color="primary"
        label={intl.formatMessage(messages.disconnect)}
        startIcon={<AccountCircleIcon />}
        onClick={this.logOutGooglePhotosBtn}
      >
        {intl.formatMessage(messages.disconnect)}
      </Button>
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
                <Alert
                  severity="error"
                  action={
                    view === 'search' ? null : (
                      <Button
                        color={'primary'}
                        onClick={async () => {
                          await this.handletryAgainClick(view);
                        }}
                        aria-label={intl.formatMessage(messages.tryAgain)}
                      >
                        {intl.formatMessage(messages.tryAgain)}
                      </Button>
                    )
                  }
                >
                  {intl.formatMessage(messages.error)}
                </Alert>
              )}
              {googlePhotosAuth && (
                <>
                  <BottomNavigation
                    value={view}
                    onChange={this.handleBottomNavChange}
                    showLabels
                    className="navigation"
                  >
                    <BottomNavigationAction
                      label={intl.formatMessage(messages.albums)}
                      value="albums"
                      icon={<PhotoAlbumRoundedIcon />}
                    />
                    <BottomNavigationAction
                      label={intl.formatMessage(messages.search)}
                      value="search"
                      icon={<ImageSearchIcon />}
                    />
                    <BottomNavigationAction
                      label={intl.formatMessage(messages.recent)}
                      value="recent"
                      icon={<VisibilityIcon />}
                    />
                  </BottomNavigation>
                  <div className="content">
                    {view === 'search' && (
                      <GooglePhotosFilter
                        filterSearch={this.handleFilterSearch}
                      />
                    )}
                    {loading && (
                      <div className="loading_container">
                        <CircularProgress size={40} thickness={7} />
                      </div>
                    )}
                    {!loading && (
                      <div className={'gallery_container'}>
                        {viewData && (
                          <>
                            <GooglePhotosSearchGallery
                              imagesData={viewData.mediaItems}
                              onSelect={this.handlePhotoSelected}
                            />
                            {viewData.nextPageToken && (
                              <div className="manage_pages">
                                <Button
                                  onClick={() => handleNextPageClick(view)}
                                  className="next_page_btn"
                                  color="secondary"
                                  variant="contained"
                                >
                                  {intl.formatMessage(messages.nextPage)}
                                </Button>
                              </div>
                            )}
                            {view === 'albums' && (
                              <Fab
                                onClick={this.onBackGallery}
                                color="primary"
                                aria-label={intl.formatMessage(
                                  messages.backToAlbumList
                                )}
                                variant="circular"
                                className="float_button"
                              >
                                <KeyboardBackspaceIcon />
                              </Fab>
                            )}
                          </>
                        )}
                        {!viewData && view === 'albums' && (
                          <>
                            <div>
                              {albumsList !== null && (
                                <List>{this.renderAlbumsList()}</List>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              {!googlePhotosAuth && googlePhotosCode && (
                <div className="loading_container">
                  <CircularProgress size={40} thickness={7} />
                </div>
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
