import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import shortid from 'shortid';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import MobileStepper from 'material-ui/MobileStepper';
import Button from 'material-ui/Button';
import SearchIcon from 'material-ui-icons/Search';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';

import messages from './BoardTileEditor.messages';
import SymbolSearch from '../SymbolSearch';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import InputImage from '../../UI/InputImage';
import IconButton from '../../UI/IconButton';
import ColorSelection from '../../UI/ColorSelection';
import './BoardTileEditor.css';

export class BoardTileEditor extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * If true, BoardTileEditor will be visibile
     */
    open: PropTypes.bool,
    /**
     * Callback fired on BoardTileEditor request to be hidden
     */
    onRequestClose: PropTypes.func.isRequired,
    /**
     * BoardTiles array to work on
     */
    editingBoardTiles: PropTypes.array,
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
    editingBoardTiles: []
  };

  constructor(props) {
    super(props);

    this.defaultBoardTile = {
      label: '',
      labelKey: '',
      vocalization: '',
      img: '',
      loadBoard: '',
      color: ''
    };

    this.defaultButtonColors = {
      folder: '#bbdefb',
      symbol: '#fff176'
    };

    this.state = {
      boardTile: this.defaultBoardTile,
      isSymbolSearchOpen: false,
      editingBoardTiles: props.editingBoardTiles,
      activeStep: 0
    };
  }

  componentWillReceiveProps(props) {
    this.updateBoardTileProperty('id', shortid.generate()); // todo not here
    this.setState({ editingBoardTiles: props.editingBoardTiles });
  }

  editingBoardTile() {
    return this.state.editingBoardTiles[this.state.activeStep];
  }

  currentBoardTileProp(prop) {
    const currentBoardTile = this.editingBoardTile();
    return currentBoardTile
      ? currentBoardTile[prop]
      : this.state.boardTile[prop];
  }

  updateEditingBoardTile(id, property, value) {
    return state => {
      const editingBoardTiles = state.editingBoardTiles.map(
        b => (b.id === id ? { ...b, ...{ [property]: value } } : b)
      );
      return { ...state, editingBoardTiles };
    };
  }

  updateNewBoardTile(property, value) {
    return state => {
      const boardTile = { ...state.boardTile, [property]: value };
      return { ...state, boardTile };
    };
  }

  updateBoardTileProperty(property, value) {
    if (this.editingBoardTile()) {
      this.setState(
        this.updateEditingBoardTile(this.editingBoardTile().id, property, value)
      );
    } else {
      this.setState(this.updateNewBoardTile(property, value));
    }
  }

  handleSubmit = () => {
    const { onEditSubmit, onAddSubmit } = this.props;

    this.setState({
      boardTile: this.defaultBoardTile,
      activeStep: 0
    });

    if (this.editingBoardTile()) {
      onEditSubmit(this.state.editingBoardTiles);
    } else {
      const tileToAdd = this.state.boardTile;
      if (!tileToAdd.color) {
        tileToAdd.color = this.getDefaultColor();
      }

      onAddSubmit(tileToAdd);
    }
  };

  handleCancel = () => {
    const { onRequestClose } = this.props;
    this.setState({
      boardTile: this.defaultBoardTile,
      activeStep: 0
    });
    onRequestClose();
  };

  handleInputImageChange = img => {
    this.updateBoardTileProperty('img', img);
  };

  handleSymbolSearchChange = ({ img, labelKey }) => {
    this.updateBoardTileProperty('labelKey', labelKey);
    this.updateBoardTileProperty('img', img);
  };

  handleSymbolSearchRequestClose = event => {
    this.setState({ isSymbolSearchOpen: false });
  };

  handleLabelChange = event => {
    this.updateBoardTileProperty('label', event.target.value);
    this.updateBoardTileProperty('labelKey', '');
  };

  handleVocalizationChange = event => {
    this.updateBoardTileProperty('vocalization', event.target.value);
  };

  handleTypeChange = (event, type) => {
    const loadBoard = type === 'folder' ? shortid.generate() : '';
    const boardTile = { ...this.state.boardTile, loadBoard };
    this.setState({ boardTile });
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
    this.updateBoardTileProperty('color', event.target.value);
  };

  getDefaultColor = () => {
    if (this.currentBoardTileProp('loadBoard') === 'folder') {
      return this.defaultButtonColors.folder;
    }

    return this.defaultButtonColors.symbol;
  };

  render() {
    const { open, intl } = this.props;

    const currentLabel = this.currentBoardTileProp('labelKey')
      ? intl.formatMessage({ id: this.currentBoardTileProp('labelKey') })
      : this.currentBoardTileProp('label');

    const buttons = (
      <IconButton
        label={intl.formatMessage(messages.symbolSearch)}
        onClick={this.handleSearchClick}
      >
        <SearchIcon />
      </IconButton>
    );

    return (
      <div className="BoardTileEditor">
        <FullScreenDialog
          disableSubmit={!currentLabel}
          buttons={buttons}
          open={open}
          title={
            <FormattedMessage
              {...(this.editingBoardTile()
                ? messages.editBoardTile
                : messages.addBoardTile)}
            />
          }
          onRequestClose={this.handleCancel}
          onSubmit={this.handleSubmit}
        >
          <Paper>
            <FullScreenDialogContent className="BoardTileEditor__container">
              <div className="BoardTileEditor__image">
                <InputImage
                  image={this.currentBoardTileProp('img') || ''}
                  onChange={this.handleInputImageChange}
                />
              </div>
              <div className="BoardTileEditor__fields">
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
                  value={this.currentBoardTileProp('vocalization') || ''}
                  onChange={this.handleVocalizationChange}
                  fullWidth
                />
                {!this.editingBoardTile() && (
                  <div className="BoardTileEditor__radiogroup">
                    <FormControl fullWidth>
                      <FormLabel>{intl.formatMessage(messages.type)}</FormLabel>
                      <RadioGroup
                        aria-label={intl.formatMessage(messages.type)}
                        name="type"
                        value={
                          this.currentBoardTileProp('loadBoard')
                            ? 'folder'
                            : 'symbol'
                        }
                        onChange={this.handleTypeChange}
                      >
                        <FormControlLabel
                          value="symbol"
                          control={<Radio />}
                          label={intl.formatMessage(messages.symbol)}
                        />
                        <FormControlLabel
                          value="folder"
                          control={<Radio />}
                          label={intl.formatMessage(messages.folder)}
                        />
                      </RadioGroup>
                    </FormControl>
                    <ColorSelection
                      selectedColor={this.state.boardTile.color}
                      onColorChange={this.handleColorChange}
                    />
                  </div>
                )}
              </div>
            </FullScreenDialogContent>

            {this.state.editingBoardTiles.length > 1 && (
              <MobileStepper
                variant="progress"
                steps={this.state.editingBoardTiles.length}
                position="static"
                activeStep={this.state.activeStep}
                nextButton={
                  <Button
                    onClick={this.handleNext}
                    disabled={
                      this.state.activeStep ===
                      this.state.editingBoardTiles.length - 1
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
            onRequestClose={this.handleSymbolSearchRequestClose}
          />
        </FullScreenDialog>
      </div>
    );
  }
}

export default injectIntl(BoardTileEditor);
