import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import shortid from 'shortid';
import Tooltip from 'material-ui/Tooltip';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import MobileStepper from 'material-ui/MobileStepper';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';

import messages from './BoardButtonDetails.messages';
import SymbolSearch from '../../SymbolSearch';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../FullScreenDialog';
import InputImage from '../../InputImage';
import ColorSelection from '../../ColorSelection';
import './BoardButtonDetails.css';

export class BoardButtonDetails extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * If true, BoardButtonDetails will be visibile
     */
    open: PropTypes.bool,
    /**
     * Callback fired on BoardButtonDetails request to be hidden
     */
    onRequestClose: PropTypes.func.isRequired,
    /**
     * BoardButtons array to work on
     */
    editingBoardButtons: PropTypes.array,
    /**
     * Callback fired when submitting edited board buttons
     */
    onEditSubmit: PropTypes.func.isRequired,
    /**
     * Callback fired when submitting a new board button
     */
    onAddSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {
    editingBoardButtons: []
  };

  constructor(props) {
    super(props);

    this.defaultBoardButton = {
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
      boardButton: this.defaultBoardButton,
      isSymbolSearchOpen: false,
      editingBoardButtons: props.editingBoardButtons,
      activeStep: 0
    };
  }

  componentWillReceiveProps(props) {
    this.updateBoardButtonProperty('id', shortid.generate()); // todo not here
    this.setState({ editingBoardButtons: props.editingBoardButtons });
  }

  editingBoardButton() {
    return this.state.editingBoardButtons[this.state.activeStep];
  }

  currentBoardButtonProp(prop) {
    const currentBoardButton = this.editingBoardButton();
    return currentBoardButton
      ? currentBoardButton[prop]
      : this.state.boardButton[prop];
  }

  updateEditingBoardButton(id, property, value) {
    return state => {
      const editingBoardButtons = state.editingBoardButtons.map(
        b => (b.id === id ? { ...b, ...{ [property]: value } } : b)
      );
      return { ...state, editingBoardButtons };
    };
  }

  updateNewBoardButton(property, value) {
    return state => {
      const boardButton = { ...state.boardButton, [property]: value };
      return { ...state, boardButton };
    };
  }

  updateBoardButtonProperty(property, value) {
    if (this.editingBoardButton()) {
      this.setState(
        this.updateEditingBoardButton(
          this.editingBoardButton().id,
          property,
          value
        )
      );
    } else {
      this.setState(this.updateNewBoardButton(property, value));
    }
  }

  handleSubmit = () => {
    const { onEditSubmit, onAddSubmit } = this.props;

    this.setState({
      boardButton: this.defaultBoardButton,
      activeStep: 0
    });

    if (this.editingBoardButton()) {
      onEditSubmit(this.state.editingBoardButtons);
    } else {
      const buttonToAdd = this.state.boardButton;
      if (!buttonToAdd.color) {
        buttonToAdd.color = this.getDefaultColor();
      }

      onAddSubmit(buttonToAdd);
    }
  };

  handleCancel = () => {
    const { onRequestClose } = this.props;
    this.setState({
      boardButton: this.defaultBoardButton,
      activeStep: 0
    });
    onRequestClose();
  };

  handleInputImageChange = img => {
    this.updateBoardButtonProperty('img', img);
  };

  handleSymbolSearchChange = ({ img, labelKey }) => {
    this.updateBoardButtonProperty('labelKey', labelKey);
    this.updateBoardButtonProperty('img', img);
  };

  handleSymbolSearchRequestClose = event => {
    this.setState({ isSymbolSearchOpen: false });
  };

  handleLabelChange = event => {
    this.updateBoardButtonProperty('label', event.target.value);
    this.updateBoardButtonProperty('labelKey', '');
  };

  handleVocalizationChange = event => {
    this.updateBoardButtonProperty('vocalization', event.target.value);
  };

  handleTypeChange = (event, type) => {
    const loadBoard = type === 'folder' ? shortid.generate() : '';
    const boardButton = { ...this.state.boardButton, loadBoard };
    this.setState({ boardButton });
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
    this.updateBoardButtonProperty('color', event.target.value);
  };

  getDefaultColor = () => {
    if (this.currentBoardButtonProp('loadBoard') === 'folder') {
      return this.defaultButtonColors.folder;
    }

    return this.defaultButtonColors.symbol;
  };

  render() {
    const { open, intl } = this.props;

    const currentLabel = this.currentBoardButtonProp('labelKey')
      ? intl.formatMessage({ id: this.currentBoardButtonProp('labelKey') })
      : this.currentBoardButtonProp('label');

    const buttons = (
      <Tooltip title="Search image" placement="bottom">
        <IconButton
          aria-label="Search image"
          color="inherit"
          onClick={this.handleSearchClick}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
    );

    return (
      <div className="BoardButtonDetails">
        <FullScreenDialog
          disableSubmit={!currentLabel}
          buttons={buttons}
          open={open}
          title={
            <FormattedMessage
              {...(this.editingBoardButton()
                ? messages.editBoardButton
                : messages.addBoardButton)}
            />
          }
          onRequestClose={this.handleCancel}
          onSubmit={this.handleSubmit}
        >
          <Paper>
            <FullScreenDialogContent className="BoardButtonDetails__container">
              <div className="BoardButtonDetails__image">
                <InputImage
                  image={this.currentBoardButtonProp('img') || ''}
                  onChange={this.handleInputImageChange}
                />
              </div>
              <div className="BoardButtonDetails__fields">
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
                  value={this.currentBoardButtonProp('vocalization') || ''}
                  onChange={this.handleVocalizationChange}
                  fullWidth
                />
                {!this.editingBoardButton() && (
                  <div className="BoardButtonDetails__radiogroup">
                    <FormControl fullWidth>
                      <FormLabel>{intl.formatMessage(messages.type)}</FormLabel>
                      <RadioGroup
                        aria-label={intl.formatMessage(messages.type)}
                        name="type"
                        value={
                          this.currentBoardButtonProp('loadBoard')
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
                      selectedColor={this.state.boardButton.color}
                      onColorChange={this.handleColorChange}
                    />
                  </div>
                )}
              </div>
            </FullScreenDialogContent>

            {this.state.editingBoardButtons.length > 1 && (
              <MobileStepper
                variant="progress"
                steps={this.state.editingBoardButtons.length}
                position="static"
                activeStep={this.state.activeStep}
                nextButton={
                  <Button
                    dense
                    onClick={this.handleNext}
                    disabled={
                      this.state.activeStep ===
                      this.state.editingBoardButtons.length - 1
                    }
                  >
                    {intl.formatMessage(messages.next)}{' '}
                    <KeyboardArrowRightIcon />
                  </Button>
                }
                backButton={
                  <Button
                    dense
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

export default injectIntl(BoardButtonDetails);
