import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import shortid from 'shortid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import messages from './TileEditor.messages';
import SymbolSearch from '../SymbolSearch';
import Symbol from '../Symbol';
import Tile from '../Tile';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import InputImage from '../../UI/InputImage';
import IconButton from '../../UI/IconButton';
import ColorSelect from '../../UI/ColorSelect';
import VoiceRecorder from '../../VoiceRecorder';
import './TileEditor.css';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import API from '../../../api';
import { isAndroid, writeCvaFile } from '../../../cordova-util';

export class TileEditor extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * If true, TileEditor will be visibile
     */
    open: PropTypes.bool,
    /**
     * Callback fired on TileEditor request to be hidden
     */
    onClose: PropTypes.func.isRequired,
    /**
     * Tiles array to work on
     */
    editingTiles: PropTypes.array,
    /**
     * Callback fired when submitting edited board tiles
     */
    onEditSubmit: PropTypes.func.isRequired,
    /**
     * Callback fired when submitting a new board tile
     */
    onAddSubmit: PropTypes.func.isRequired,
    boards: PropTypes.array
  };

  static defaultProps = {
    editingTiles: []
  };

  constructor(props) {
    super(props);

    this.defaultTileColors = {
      folder: '#bbdefb',
      button: '#fff176',
      board: '#999999'
    };

    this.defaultTile = {
      label: '',
      labelKey: '',
      vocalization: '',
      image: '',
      loadBoard: '',
      sound: '',
      type: 'button',
      backgroundColor: this.defaultTileColors.button,
      linkedBoard: false
    };

    this.state = {
      activeStep: 0,
      editingTiles: props.editingTiles,
      isSymbolSearchOpen: false,
      selectedBackgroundColor: '',
      tile: this.defaultTile,
      linkedBoard: '',
      isImageUploaded: false,
      rotateDeg: 0,
      savedImage: null,
      fileName: ''
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.updateTileProperty('id', shortid.generate()); // todo not here
    this.setState({ editingTiles: props.editingTiles });
  }

  editingTile() {
    return this.state.editingTiles[this.state.activeStep];
  }

  currentTileProp(prop) {
    const currentTile = this.editingTile();
    return currentTile ? currentTile[prop] : this.state.tile[prop];
  }

  updateEditingTile(id, property, value) {
    return state => {
      const editingTiles = state.editingTiles.map(b =>
        b.id === id ? { ...b, ...{ [property]: value } } : b
      );
      return { ...state, editingTiles };
    };
  }

  updateNewTile(property, value) {
    return state => {
      const tile = { ...state.tile, [property]: value };
      return { ...state, tile };
    };
  }

  updateTileProperty(property, value) {
    if (this.editingTile()) {
      this.setState(
        this.updateEditingTile(this.editingTile().id, property, value)
      );
    } else {
      this.setState(this.updateNewTile(property, value));
    }
  }

  handleSubmit = async () => {
    const { onEditSubmit, onAddSubmit } = this.props;

    this.setState({
      activeStep: 0,
      selectedBackgroundColor: '',
      tile: this.defaultTile,
      isImageUploaded: false,
      rotateDeg: 0,
      savedImage: null,
      fileName: ''
    });
    if (this.editingTile()) {
      this.props.editingTiles.forEach((editedTile, index) =>
        console.log(editedTile.image !== this.state.editingTiles[index].image)
      );

      if (
        this.state.editingTiles[0].image !== this.props.editingTiles[0].image
      ) {
        console.log('logrado');
      }

      onEditSubmit(this.state.editingTiles);
    } else {
      const tileToAdd = this.state.tile;
      // console.log("hola", tileToAdd)

      const isImageUploaded = this.state.isImageUploaded;
      if (isImageUploaded) {
        tileToAdd.image = await this.updateTileImgURL();
      }

      const selectedBackgroundColor = this.state.selectedBackgroundColor;
      if (selectedBackgroundColor) {
        tileToAdd.backgroundColor = selectedBackgroundColor;
      }
      onAddSubmit(tileToAdd);
    }
  };

  updateTileImgURL = async () => {
    const newUrl = await this.saveImageInApi();
    console.log('newUrl', typeof newUrl);
    return newUrl;
  };

  handleCancel = () => {
    const { onClose } = this.props;

    this.setState({
      activeStep: 0,
      selectedBackgroundColor: '',
      tile: this.defaultTile,
      isImageUploaded: false,
      rotateDeg: 0,
      savedImage: null,
      fileName: ''
    });
    onClose();
  };

  async saveImageInApi() {
    //const { userData } = this.props;
    const { savedImage, fileName } = this.state;
    const blob = this.dataURItoBlob(savedImage);
    // const user = userData.email ? userData : null;
    // if (user) {
    // this.setState({
    //   loading: true
    // });
    try {
      const imageUrl = 'holaURL'; //await API.uploadFile(blob, fileName);
      console.log('imagen guardada en servidor', imageUrl);
      return imageUrl;
    } catch (error) {
      console.log('imagen no guardad en servidor');
      console.log(fileName);
      if (isAndroid()) {
        console.log(fileName);
        const filePath = '/Android/data/com.unicef.cboard/files/' + fileName;
        const fEntry = await writeCvaFile(filePath, blob);
        console.log(fEntry);
        // var timestamp = new Date().getTime();
        // var queryString = fEntry.nativeURL + '?t=' + timestamp; //with timestamp the image will be loaded every time you rotate
        //this.handleInputImageChange(fEntry.nativeURL, fileName);
        return fEntry.nativeURL;
      }
      // } finally {
      //   this.setState({
      //     loading: false
      //   });
    }
    // }
  }
  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  handleInputImageChange = (image, fileName) => {
    this.setState({ isImageUploaded: true });
    this.updateTileProperty('image', image);
    this.setState({ savedImage: image, fileName: fileName });
  };

  handleSymbolSearchChange = ({ image, labelKey, label }) => {
    this.updateTileProperty('labelKey', labelKey);
    this.updateTileProperty('label', label);
    this.updateTileProperty('image', image);
  };

  handleSymbolSearchClose = event => {
    this.setState({ isSymbolSearchOpen: false });
  };

  handleLabelChange = event => {
    this.updateTileProperty('label', event.target.value);
    this.updateTileProperty('labelKey', '');
  };

  handleVocalizationChange = event => {
    this.updateTileProperty('vocalization', event.target.value);
  };
  handleSoundChange = sound => {
    this.updateTileProperty('sound', sound);
  };
  handleTypeChange = (event, type) => {
    let loadBoard = '';
    if (type === 'folder' || type === 'board') {
      loadBoard = shortid.generate();
    }
    let backgroundColor = this.defaultTileColors.button;
    if (type === 'board') {
      backgroundColor = this.defaultTileColors.board;
    }
    if (type === 'folder') {
      backgroundColor = this.defaultTileColors.folder;
    }
    const tile = {
      ...this.state.tile,
      linkedBoard: false,
      backgroundColor,
      loadBoard,
      type
    };
    this.setState({ tile, linkedBoard: '' });
  };

  handleBack = event => {
    this.setState({ activeStep: this.state.activeStep - 1 });
    this.setState({ selectedBackgroundColor: '', linkedBoard: '' });
    this.setState({ isImageUploaded: false, rotateDeg: 0 });
  };

  handleNext = async event => {
    // const image = await this.saveImageInApi();
    // this.updateTileProperty('image', image);

    this.setState({ activeStep: this.state.activeStep + 1 });
    this.setState({ selectedBackgroundColor: '', linkedBoard: '' });
    this.setState({ isImageUploaded: false, rotateDeg: 0 });
  };

  handleSearchClick = event => {
    this.setState({ isSymbolSearchOpen: true });
    this.resetRotation();
  };

  handleColorChange = event => {
    const color = event ? event.target.value : '';
    this.setState({ selectedBackgroundColor: color });
    if (event) {
      this.updateTileProperty('backgroundColor', event.target.value);
    } else {
      this.updateTileProperty('backgroundColor', this.getDefaultColor());
    }
  };

  getDefaultColor = () => {
    if (this.currentTileProp('type') === 'folder') {
      return this.defaultTileColors.folder;
    }
    if (this.currentTileProp('type') === 'button') {
      return this.defaultTileColors.button;
    }
    if (this.currentTileProp('type') === 'board') {
      return this.defaultTileColors.board;
    }
  };

  handleBoardsChange = event => {
    const board = event ? event.target.value : '';
    this.setState({ linkedBoard: board });
    if (board && board !== 'none') {
      this.updateTileProperty('linkedBoard', true);
      this.updateTileProperty('loadBoard', board.id);
    } else {
      this.updateTileProperty('linkedBoard', false);
    }
  };

  handleOnClickRotationRigth = () => {
    let actualPosition = this.state.rotateDeg;
    actualPosition === 270
      ? this.setState({ rotateDeg: 0 })
      : this.setState({ rotateDeg: actualPosition + 90 });
  };
  handleOnClickRotationLeft = () => {
    let actualPosition = this.state.rotateDeg;
    actualPosition === 0
      ? this.setState({ rotateDeg: 270 })
      : this.setState({ rotateDeg: actualPosition - 90 });
  };

  resetRotation = () => {
    this.setState({ isImageUploaded: false, rotateDeg: 0 });
  };

  render() {
    const { open, intl, boards } = this.props;
    const currentLabel = this.currentTileProp('labelKey')
      ? intl.formatMessage({ id: this.currentTileProp('labelKey') })
      : this.currentTileProp('label');

    const buttons = (
      <IconButton
        label={intl.formatMessage(messages.symbolSearch)}
        onClick={this.handleSearchClick}
      >
        <SearchIcon />
      </IconButton>
    );
    const selectBoardElement = (
      <div>
        <FormControl fullWidth>
          <InputLabel id="boards-input-label">
            {intl.formatMessage(messages.existingBoards)}
          </InputLabel>
          <Select
            labelId="boards-select-label"
            id="boards-select"
            autoWidth={true}
            value={this.state.linkedBoard}
            onChange={this.handleBoardsChange}
          >
            <MenuItem value="none">
              <em>{intl.formatMessage(messages.none)}</em>
            </MenuItem>
            {boards.map(
              board =>
                !board.hidden && (
                  <MenuItem key={board.id} value={board}>
                    {board.name}
                  </MenuItem>
                )
            )}
          </Select>
        </FormControl>
      </div>
    );
    const tileInView = this.editingTile()
      ? this.editingTile()
      : this.state.tile;

    return (
      <div className="TileEditor">
        <FullScreenDialog
          disableSubmit={!currentLabel}
          buttons={buttons}
          open={open}
          title={
            <FormattedMessage
              {...(this.editingTile()
                ? messages.editTile
                : messages.createTile)}
            />
          }
          onClose={this.handleCancel}
          onSubmit={this.handleSubmit}
        >
          <Paper>
            <FullScreenDialogContent className="TileEditor__container">
              <div className="TileEditor__row">
                <div className="TileEditor__main-info">
                  <div className="TileEditor__picto-fields">
                    <div className="TileEditor__preview">
                      <Tile
                        backgroundColor={
                          this.state.selectedBackgroundColor ||
                          tileInView.backgroundColor
                        }
                        variant={
                          Boolean(tileInView.loadBoard) ? 'folder' : 'button'
                        }
                      >
                        <Symbol image={tileInView.image} label={currentLabel} />
                      </Tile>
                    </div>
                    {this.state.isImageUploaded && (
                      <div className="TileEditor__rotateimage">
                        <IconButton
                          label={intl.formatMessage(messages.rotateLeft)}
                          onClick={this.handleOnClickRotationLeft}
                        >
                          <RotateLeftIcon />
                        </IconButton>
                        <IconButton
                          label={intl.formatMessage(messages.rotateRight)}
                          onClick={this.handleOnClickRotationRigth}
                        >
                          <RotateRightIcon />
                        </IconButton>
                      </div>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SearchIcon />}
                      onClick={this.handleSearchClick}
                    >
                      {intl.formatMessage(messages.symbols)}
                    </Button>
                    <div className="TileEditor__input-image">
                      <InputImage
                        onChange={this.handleInputImageChange}
                        rotateDeg={this.state.rotateDeg}
                        isImageUploaded={this.state.isImageUploaded}
                        resetRotation={this.resetRotation}
                      />
                    </div>
                  </div>
                  <div className="TileEditor__form-fields">
                    <TextField
                      id="label"
                      label={
                        this.currentTileProp('type') === 'board'
                          ? intl.formatMessage(messages.boardName)
                          : intl.formatMessage(messages.label)
                      }
                      value={currentLabel}
                      onChange={this.handleLabelChange}
                      fullWidth
                      required
                    />

                    <TextField
                      multiline
                      id="vocalization"
                      disabled={this.currentTileProp('type') === 'board'}
                      label={intl.formatMessage(messages.vocalization)}
                      value={this.currentTileProp('vocalization') || ''}
                      onChange={this.handleVocalizationChange}
                      fullWidth
                    />
                    <div>
                      {this.editingTile() &&
                        tileInView.loadBoard &&
                        selectBoardElement}
                    </div>
                    {!this.editingTile() && (
                      <div className="TileEditor__radiogroup">
                        <FormControl fullWidth>
                          <FormLabel>
                            {intl.formatMessage(messages.type)}
                          </FormLabel>
                          <RadioGroup
                            row={true}
                            aria-label={intl.formatMessage(messages.type)}
                            name="type"
                            value={this.currentTileProp('type')}
                            onChange={this.handleTypeChange}
                          >
                            <FormControlLabel
                              value="button"
                              control={<Radio />}
                              label={intl.formatMessage(messages.button)}
                            />
                            <FormControlLabel
                              className="TileEditor__radiogroup__formcontrollabel"
                              value="folder"
                              control={<Radio />}
                              label={intl.formatMessage(messages.folder)}
                            />
                            <FormControlLabel
                              className="TileEditor__radiogroup__formcontrollabel"
                              value="board"
                              control={<Radio />}
                              label={intl.formatMessage(messages.board)}
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>
                    )}
                    {this.currentTileProp('type') === 'folder' &&
                      selectBoardElement}
                  </div>
                </div>
              </div>
              <div className="TileEditor__row">
                <div className="TileEditor__form-fields">
                  <div className="TileEditor__colorselect">
                    <ColorSelect
                      selectedColor={this.state.selectedBackgroundColor}
                      onChange={this.handleColorChange}
                    />
                  </div>
                  {this.currentTileProp('type') !== 'board' && (
                    <div className="TileEditor__voicerecorder">
                      <FormLabel>
                        {intl.formatMessage(messages.voiceRecorder)}
                      </FormLabel>
                      <VoiceRecorder
                        src={this.currentTileProp('sound')}
                        onChange={this.handleSoundChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </FullScreenDialogContent>

            {this.state.editingTiles.length > 1 && (
              <MobileStepper
                variant="progress"
                steps={this.state.editingTiles.length}
                position="static"
                activeStep={this.state.activeStep}
                nextButton={
                  <Button
                    onClick={this.handleNext}
                    disabled={
                      this.state.activeStep ===
                      this.state.editingTiles.length - 1
                    }
                  >
                    {intl.formatMessage(messages.next)}{' '}
                    <KeyboardArrowRightIcon />
                  </Button>
                }
                backButton={
                  <Button
                    onClick={this.handleBack}
                    disabled={this.state.activeStep === 0}
                  >
                    <KeyboardArrowLeftIcon />
                    {intl.formatMessage(messages.back)}
                  </Button>
                }
              />
            )}
          </Paper>

          <SymbolSearch
            open={this.state.isSymbolSearchOpen}
            onChange={this.handleSymbolSearchChange}
            onClose={this.handleSymbolSearchClose}
          />
        </FullScreenDialog>
      </div>
    );
  }
}

export default injectIntl(TileEditor);
