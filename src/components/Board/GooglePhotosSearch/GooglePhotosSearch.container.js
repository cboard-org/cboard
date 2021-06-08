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

  gotAlbums = async () => {
    const albumsList = await getAlbums(
      this.authToken.tokens.access_token.toString()
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
      this.authToken.tokens.access_token.toString(),
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

  renderAlbumsList() {
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
  }

  componentDidMount = async () => {
    if (this.props.googlePhotosCode) {
      this.authToken = await getAuthtoken(this.props.googlePhotosCode);
      if (!this.state.albumsList) this.gotAlbums();
    }
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
          fullWidth={true}
        >
          <Paper>
            <FullScreenDialogContent>
              {googlePhotosCode ? (
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
                      ) : (
                        <List>
                          {this.state.albumsList
                            ? this.renderAlbumsList()
                            : null}
                        </List>
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

export default injectIntl(GooglePhotosSearch);
