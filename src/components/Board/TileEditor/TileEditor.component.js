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
import EditIcon from '@material-ui/icons/Edit';
import ImageEditor from '../ImageEditor';

import API from '../../../api';
import { isAndroid, writeCvaFile } from '../../../cordova-util';
import { convertImageUrlToCatchable } from '../../../helpers';

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
    boards: PropTypes.array,
    userData: PropTypes.object
  };

  static defaultProps = {
    editingTiles: [],
    openImageEditor: false
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
      autoFill: '',
      selectedBackgroundColor: '',
      tile: this.defaultTile,
      linkedBoard: '',
      imageUploadedData: [],
      isEditImageBtnActive: false
    };

    this.defaultimageUploadedData = {
      isUploaded: false,
      fileName: '',
      blobHQ: null,
      blob: null
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.updateTileProperty('id', shortid.generate()); // todo not here
    this.setState({ editingTiles: props.editingTiles });
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.open !== prevProps.open &&
      this.props.open &&
      this.editingTile()
    ) {
      this.setLinkedBoard();
    }
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
    if (this.editingTile()) {
      const { imageUploadedData } = this.state;
      if (imageUploadedData.length) {
        let tilesToAdd = JSON.parse(JSON.stringify(this.state.editingTiles));
        await Promise.all(
          imageUploadedData.map(async (obj, index) => {
            if (obj.isUploaded) {
              tilesToAdd[index].image = await this.updateTileImgURL(
                obj.blob,
                obj.fileName
              );
            }
          })
        );
        onEditSubmit(tilesToAdd);
      } else {
        onEditSubmit(this.state.editingTiles);
      }
    } else {
      const tileToAdd = this.state.tile;
      const imageUploadedData = this.state.imageUploadedData[
        this.state.activeStep
      ];
      if (imageUploadedData && imageUploadedData.isUploaded) {
        tileToAdd.image = await this.updateTileImgURL(
          imageUploadedData.blob,
          imageUploadedData.fileName
        );
      }

      const selectedBackgroundColor = this.state.selectedBackgroundColor;
      if (selectedBackgroundColor) {
        tileToAdd.backgroundColor = selectedBackgroundColor;
      }
      onAddSubmit(tileToAdd);
    }

    this.setState({
      activeStep: 0,
      selectedBackgroundColor: '',
      tile: this.defaultTile,
      imageUploadedData: [],
      isEditImageBtnActive: false,
      linkedBoard: ''
    });
  };

  updateTileImgURL = async (blob, fileName) => {
    const { userData } = this.props;
    const user = userData.email ? userData : null;
    if (user) {
      // this.setState({
      //   loading: true
      // });
      try {
        const imageUrl = await API.uploadFile(blob, fileName);
        // console.log('imagen guardada en servidor', imageUrl);
        return convertImageUrlToCatchable(imageUrl) || imageUrl;
      } catch (error) {
        //console.log('imagen no guardad en servidor');
        return await this.blobToBase64(blob);
      }
      // } finally {
      //   this.setState({
      //     loading: false
      //   });
    } else {
      if (isAndroid()) {
        const filePath = '/Android/data/com.unicef.cboard/files/' + fileName;
        const fEntry = await writeCvaFile(filePath, blob);
        return fEntry.nativeURL;
      } else {
        return await this.blobToBase64(blob);
      }
    }
  };

  blobToBase64 = async blob => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  handleCancel = () => {
    const { onClose } = this.props;
    this.setState({
      activeStep: 0,
      selectedBackgroundColor: '',
      tile: this.defaultTile,
      imageUploadedData: [],
      isEditImageBtnActive: false,
      linkedBoard: ''
    });
    onClose();
  };

  createimageUploadedDataArray() {
    if (this.editingTile()) {
      let imageUploadedDataArray = new Array(this.state.editingTiles.length);
      imageUploadedDataArray.fill(this.defaultimageUploadedData);
      this.setState({ imageUploadedData: imageUploadedDataArray });
    } else {
      this.setState({
        imageUploadedData: new Array(this.defaultimageUploadedData)
      });
    }
  }

  handleInputImageChange = (blob, fileName, blobHQ) => {
    if (!this.state.imageUploadedData.length) {
      this.createimageUploadedDataArray();
    }
    this.setimageUploadedData(true, fileName, blobHQ, blob);
    this.setState({ isEditImageBtnActive: true });
    const image = URL.createObjectURL(blob);
    this.updateTileProperty('image', image);
  };

  setimageUploadedData = (isUploaded, fileName, blobHQ = null, blob = null) => {
    const { activeStep } = this.state;
    let imageUploadedData = this.state.imageUploadedData.map((item, indx) => {
      if (indx === activeStep) {
        return {
          ...item,
          isUploaded: isUploaded,
          fileName: fileName,
          blobHQ: blobHQ,
          blob: blob
        };
      } else {
        return item;
      }
    });
    this.setState({ imageUploadedData: imageUploadedData });
  };

  handleSymbolSearchChange = ({ image, labelKey, label }) => {
    return new Promise(resolve => {
      this.updateTileProperty('labelKey', labelKey);
      this.updateTileProperty('label', label);
      this.updateTileProperty('image', image);
      if (this.state.imageUploadedData.length) {
        this.setimageUploadedData(false, '');
      }
      resolve();
    });
  };

  handleSymbolSearchClose = event => {
    const { imageUploadedData } = this.state;
    this.setState({ isSymbolSearchOpen: false });
    if (
      imageUploadedData.length &&
      imageUploadedData[this.state.activeStep].isUploaded
    ) {
      this.setState({ isEditImageBtnActive: true });
    }
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
    this.setState({ activeStep: this.state.activeStep - 1 }, () => {
      this.setLinkedBoard();
    });
    this.setState({ selectedBackgroundColor: '' });
    this.setState({ isEditImageBtnActive: false });
  };

  handleNext = async event => {
    this.setState({ activeStep: this.state.activeStep + 1 }, () => {
      this.setLinkedBoard();
    });
    this.setState({ selectedBackgroundColor: '' });
    this.setState({ isEditImageBtnActive: false });
  };

  handleSearchClick = (event, currentLabel) => {
    this.setState({ isSymbolSearchOpen: true, autoFill: currentLabel || '' });
    this.setState({ isEditImageBtnActive: false });
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
      this.updateTileProperty('loadBoard', shortid.generate());
    }
  };

  handleOnClickImageEditor = () => {
    this.setState({ openImageEditor: true });
  };
  onImageEditorClose = () => {
    this.setState({ openImageEditor: false });
  };
  onImageEditorDone = blob => {
    this.setState(prevState => {
      const newArray = [...prevState.imageUploadedData];
      newArray[this.state.activeStep].blob = blob;
      return { imageUploadedData: newArray };
    });
    const image = URL.createObjectURL(blob);
    this.updateTileProperty('image', image);
  };

  setLinkedBoard = () => {
    const loadBoard =
      this.currentTileProp('linkedBoard') || this.editingTile()
        ? this.currentTileProp('loadBoard')
        : null;
    const linkedBoard =
      this.props.boards.find(board => board.id === loadBoard) || 'none';
    this.setState({ linkedBoard: linkedBoard });
  };

  render() {
    const { open, intl, boards } = this.props;
    const currentLabel = this.currentTileProp('labelKey')
      ? intl.formatMessage({ id: this.currentTileProp('labelKey') })
      : this.currentTileProp('label');
    const buttons = (
      <IconButton
        label={intl.formatMessage(messages.symbolSearch)}
        onClick={e => this.handleSearchClick(e, currentLabel)}
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
            {!this.editingTile() && (
              <MenuItem value="none">
                <em>{intl.formatMessage(messages.none)}</em>
              </MenuItem>
            )}
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
                    {this.state.isEditImageBtnActive && (
                      <React.Fragment>
                        <ImageEditor
                          intl={intl}
                          open={this.state.openImageEditor}
                          onImageEditorClose={this.onImageEditorClose}
                          onImageEditorDone={this.onImageEditorDone}
                          image={URL.createObjectURL(
                            this.state.imageUploadedData[this.state.activeStep]
                              .blobHQ
                          )}
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<EditIcon />}
                          onClick={this.handleOnClickImageEditor}
                          style={{ marginBottom: '6px' }}
                        >
                          {intl.formatMessage(messages.editImage)}
                        </Button>
                      </React.Fragment>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SearchIcon />}
                      onClick={e => this.handleSearchClick(e, currentLabel)}
                    >
                      {intl.formatMessage(messages.symbols)}
                    </Button>
                    <div className="TileEditor__input-image">
                      <InputImage onChange={this.handleInputImageChange} />
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
            autoFill={this.state.autoFill}
            onChange={this.handleSymbolSearchChange}
            onClose={this.handleSymbolSearchClose}
          />
        </FullScreenDialog>
      </div>
    );
  }
}

export default injectIntl(TileEditor);
