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
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';

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
    /**
     * remoove full screen dialog
     */
    parcialScreen: PropTypes.bool,
    boards: PropTypes.array
  };

  static defaultProps = {
    editingTiles: [],
    parcialScreen: false
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
      linkedBoard: ''
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    //this.updateTileProperty('id', shortid.generate()); // todo not here
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

  handleSubmit = () => {
    const { onEditSubmit, onAddSubmit } = this.props;

    this.setState({
      activeStep: 0,
      selectedBackgroundColor: '',
      tile: this.defaultTile
    });

    if (this.editingTile()) {
      onEditSubmit(this.state.editingTiles);
    } else {
      const tileToAdd = this.state.tile;
      tileToAdd.id = shortid.generate();
      const selectedBackgroundColor = this.state.selectedBackgroundColor;

      if (selectedBackgroundColor) {
        tileToAdd.backgroundColor = selectedBackgroundColor;
      }
      onAddSubmit(tileToAdd);
    }
  };

  handleCancel = () => {
    const { onClose } = this.props;

    this.setState({
      activeStep: 0,
      selectedBackgroundColor: '',
      tile: this.defaultTile
    });
    onClose();
  };

  handleInputImageChange = image => {
    this.updateTileProperty('image', image);
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
  };

  handleNext = event => {
    this.setState({ activeStep: this.state.activeStep + 1 });
    this.setState({ selectedBackgroundColor: '', linkedBoard: '' });
  };

  handleSearchClick = event => {
    this.setState({ isSymbolSearchOpen: true });
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

  render() {
    const { open, intl, boards, parcialScreen } = this.props;

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

    const tileEditorContent = (
      <>
        <div className="TileEditor__row">
          <div className="TileEditor__main-info">
            <div className="TileEditor__picto-fields">
              <div className="TileEditor__preview">
                <Tile
                  backgroundColor={
                    this.state.selectedBackgroundColor ||
                    tileInView.backgroundColor
                  }
                  variant={Boolean(tileInView.loadBoard) ? 'folder' : 'button'}
                >
                  <Symbol image={tileInView.image} label={currentLabel} />
                </Tile>
              </div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={this.handleSearchClick}
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
              <div>
                {this.editingTile() &&
                  tileInView.loadBoard &&
                  selectBoardElement}
              </div>
              {!this.editingTile() && (
                <div className="TileEditor__radiogroup">
                  <FormControl fullWidth>
                    <FormLabel>{intl.formatMessage(messages.type)}</FormLabel>
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
              {this.currentTileProp('type') === 'folder' && selectBoardElement}
            </div>
          </div>
        </div>
        <div className="TileEditor__row">
          <div
            className={
              parcialScreen
                ? 'TileEditorDialog__form-fields'
                : 'TileEditor__form-fields'
            }
          >
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
                  this.state.activeStep === this.state.editingTiles.length - 1
                }
              >
                {intl.formatMessage(messages.next)} <KeyboardArrowRightIcon />
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
      </>
    );

    const symbolSearch = (
      <SymbolSearch
        open={this.state.isSymbolSearchOpen}
        onChange={this.handleSymbolSearchChange}
        onClose={this.handleSymbolSearchClose}
      />
    );

    const parcialScreenContent = (
      <Dialog
        open={this.props.open}
        aria-labelledby="add-tile-dialog"
        onClose={(event, reason) => {
          console.log('close');
          if (reason === 'backdropClick') {
            this.handleCancel();
          }
        }}
        scroll="paper"
        className={'TileEditorDialog'}
      >
        <DialogContent className={'TileEditorDialogContent'}>
          {tileEditorContent}
          <DialogActions className={'TileEditor__dialogActions'}>
            <Button
              style={{ fontSize: '1.3em' }}
              onClick={this.handleCancel}
              color="primary"
              size="large"
            >
              {intl.formatMessage(messages.cancel)}
            </Button>
            <Button
              style={{ fontSize: '1.3em' }}
              disabled={!currentLabel}
              onClick={() => {
                this.handleSubmit();
                this.props.onClose();
              }}
              color="primary"
              autoFocus
              size="large"
            >
              {intl.formatMessage(messages.save)}
            </Button>
          </DialogActions>
          {symbolSearch}
        </DialogContent>
      </Dialog>
    );

    const fullScreenContent = (
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
            <FullScreenDialogContent className="TileEditor__container" />
            {tileEditorContent}
          </Paper>

          {symbolSearch}
        </FullScreenDialog>
      </div>
    );

    if (parcialScreen) return parcialScreenContent;

    return fullScreenContent;
  }
}

export default injectIntl(TileEditor);
