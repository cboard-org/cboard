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

import messages from './TileEditor.messages';
import SymbolSearch from '../SymbolSearch';
import Symbol from '../Symbol';
import Tile from '../Tile';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import InputImage from '../../UI/InputImage';
import IconButton from '../../UI/IconButton';
import ColorSelection from '../../UI/ColorSelection';
import './TileEditor.css';

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
    onAddSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {
    editingTiles: []
  };

  constructor(props) {
    super(props);

    this.defaultTileColors = {
      folder: '#bbdefb',
      symbol: '#fff176'
    };

    this.defaultTile = {
      label: '',
      labelKey: '',
      vocalization: '',
      image: '',
      loadBoard: '',
      backgroundColor: this.defaultTileColors.symbol
    };

    this.state = {
      tile: this.defaultTile,
      isSymbolSearchOpen: false,
      editingTiles: props.editingTiles,
      selectedBackgroundColor: '',
      activeStep: 0
    };
  }

  componentWillReceiveProps(props) {
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
      const editingTiles = state.editingTiles.map(
        b => (b.id === id ? { ...b, ...{ [property]: value } } : b)
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
      tile: this.defaultTile,
      selectedBackgroundColor: '',
      activeStep: 0
    });

    if (this.editingTile()) {
      onEditSubmit(this.state.editingTiles);
    } else {
      const tileToAdd = this.state.tile;
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
      tile: this.defaultTile,
      activeStep: 0
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

  handleTypeChange = (event, type) => {
    const typeFolder = type === 'folder';
    const loadBoard = typeFolder ? shortid.generate() : '';
    const backgroundColor = typeFolder
      ? this.defaultTileColors.folder
      : this.defaultTileColors.symbol;
    const tile = { ...this.state.tile, backgroundColor, loadBoard };
    this.setState({ tile });
  };

  handleBack = event => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleNext = event => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleSearchClick = event => {
    this.setState({ isSymbolSearchOpen: true });
  };

  handleColorChange = event => {
    const color = event ? event.target.value : '';
    this.setState({ selectedBackgroundColor: color });
  };

  getDefaultColor = () => {
    if (this.currentTileProp('loadBoard')) {
      return this.defaultTileColors.folder;
    }

    return this.defaultTileColors.symbol;
  };

  render() {
    const { open, intl } = this.props;

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
              <div>
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
                    <Symbol image={tileInView.image} label={tileInView.label} />
                  </Tile>
                </div>
                <div className="TileEditor__input-image">
                  <InputImage onChange={this.handleInputImageChange} />
                </div>
              </div>
              <div className="TileEditor__fields">
                <TextField
                  id="label"
                  label={intl.formatMessage(messages.label)}
                  value={currentLabel}
                  onChange={this.handleLabelChange}
                  fullWidth
                  required
                />

                <TextField
                  id="vocalization"
                  label={intl.formatMessage(messages.vocalization)}
                  value={this.currentTileProp('vocalization') || ''}
                  onChange={this.handleVocalizationChange}
                  fullWidth
                />
                {!this.editingTile() && (
                  <div className="TileEditor__radiogroup">
                    <FormControl fullWidth>
                      <FormLabel>{intl.formatMessage(messages.type)}</FormLabel>
                      <RadioGroup
                        aria-label={intl.formatMessage(messages.type)}
                        name="type"
                        value={
                          this.currentTileProp('loadBoard')
                            ? 'folder'
                            : 'button'
                        }
                        onChange={this.handleTypeChange}
                      >
                        <FormControlLabel
                          value="button"
                          control={<Radio />}
                          label={intl.formatMessage(messages.button)}
                        />
                        <FormControlLabel
                          value="folder"
                          control={<Radio />}
                          label={intl.formatMessage(messages.folder)}
                        />
                      </RadioGroup>
                    </FormControl>
                    <ColorSelection
                      selectedColor={this.state.selectedBackgroundColor}
                      onColorChange={this.handleColorChange}
                    />
                  </div>
                )}
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
