import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import shortid from 'shortid';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import TextField from 'material-ui/TextField';
import MobileStepper from 'material-ui/MobileStepper';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';

import messages from './messages';
import SymbolSearch from '../../SymbolSearch';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../FullScreenDialog';
import InputImage from '../../InputImage';

import './BoardButtonDetails.css';

export class BoardButtonDetails extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onRequestClose: PropTypes.func,
    editingBoardButtons: PropTypes.array
  };

  static defaultProps = {
    editingBoardButtons: []
  };

  constructor(props) {
    super(props);

    this.defaultBoardButton = {
      type: 'symbol',
      label: '',
      vocalization: '',
      img: '',
      boardId: ''
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
      onAddSubmit(this.state.boardButton);
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

  handleSymbolSearchChange = ({ img, label }) => {
    this.updateBoardButtonProperty('label', label);
    this.updateBoardButtonProperty('img', img);
  };

  handleSymbolSearchRequestClose = event => {
    this.setState({ isSymbolSearchOpen: false });
  };

  handleLabelChange = event => {
    this.updateBoardButtonProperty('label', event.target.value);
  };

  handleVocalizationChange = (event, v, x) => {
    this.updateBoardButtonProperty('vocalization', event.target.value);
  };

  handleTypeChange = (event, type) => {
    const boardId = type === 'folder' ? this.state.boardButton.label : '';
    const boardButton = { ...this.state.boardButton, type, boardId };
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

  render() {
    const { open, intl } = this.props;
    const currentLabel = this.currentBoardButtonProp('label')
      ? intl.formatMessage({ id: this.currentBoardButtonProp('label') })
      : '';

    const buttons = (
      <IconButton color="contrast" onClick={this.handleSearchClick}>
        <SearchIcon />
      </IconButton>
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
                ? messages.editSymbol
                : messages.addSymbol)}
            />
          }
          onRequestClose={this.handleCancel}
          onSubmit={this.handleSubmit}
        >
          <FullScreenDialogContent className="BoardButtonDetails__container">
            <div className="BoardButtonDetails__symbol">
              <InputImage
                label={intl.formatMessage(messages.uploadAnImage)}
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
                  <FormControl>
                    <FormLabel>{intl.formatMessage(messages.type)}</FormLabel>
                    <RadioGroup
                      aria-label={intl.formatMessage(messages.type)}
                      name="type"
                      value={this.currentBoardButtonProp('type') || 'symbol'}
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
                </div>
              )}
            </div>
          </FullScreenDialogContent>

          {this.state.editingBoardButtons.length > 1 && (
            <MobileStepper
              type="progress"
              steps={this.state.editingBoardButtons.length}
              position="static"
              activeStep={this.state.activeStep}
              onBack={this.handleBack}
              onNext={this.handleNext}
              nextButton={
                <Button
                  dense
                  onClick={this.handleNext}
                  disabled={
                    this.state.activeStep ===
                    this.state.editingBoardButtons.length - 1
                  }
                >
                  {intl.formatMessage(messages.next)} <KeyboardArrowRightIcon />
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
