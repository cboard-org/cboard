import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import SymbolSearch from '../SymbolSearch';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../../components/FullScreenDialog';
import InputImage from '../../../components/InputImage';

import './SymbolDetails.css';

export class SymbolDetails extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onRequestClose: PropTypes.func,
    editingSymbol: PropTypes.array
  };

  static defaultProps = {
    editingSymbols: []
  };

  constructor(props) {
    super(props);

    this.defaultSymbol = {
      type: 'symbol',
      label: '',
      vocalization: '',
      img: '',
      boardId: ''
    };

    this.state = {
      symbol: this.defaultSymbol,
      isSymbolSearchOpen: false,
      editingSymbols: props.editingSymbols,
      activeStep: 0
    };
  }

  componentWillReceiveProps(props) {
    this.updateSymbolProperty('id', shortid.generate()); // todo not here
    this.setState({ editingSymbols: props.editingSymbols });
  }

  editingSymbol() {
    return this.state.editingSymbols[this.state.activeStep];
  }

  currentSymbolProp(prop) {
    const currentSymbol = this.editingSymbol();
    return currentSymbol ? currentSymbol[prop] : this.state.symbol[prop];
  }

  updateEditingSymbol(id, property, value) {
    return state => {
      const editingSymbols = state.editingSymbols.map(
        s => (s.id === id ? { ...s, ...{ [property]: value } } : s)
      );
      return { ...state, editingSymbols };
    };
  }

  updateNewSymbol(property, value) {
    return state => {
      const symbol = { ...state.symbol, [property]: value };
      return { ...state, symbol };
    };
  }

  updateSymbolProperty(property, value) {
    if (this.editingSymbol()) {
      this.setState(
        this.updateEditingSymbol(this.editingSymbol().id, property, value)
      );
    } else {
      this.setState(this.updateNewSymbol(property, value));
    }
  }

  handleSubmit = () => {
    const { onEditSubmit, onAddSubmit } = this.props;

    this.setState({
      symbol: this.defaultSymbol,
      activeStep: 0
    });

    if (this.editingSymbol()) {
      onEditSubmit(this.state.editingSymbols);
    } else {
      onAddSubmit(this.state.symbol);
    }
  };

  handleCancel = () => {
    const { onRequestClose } = this.props;
    this.setState({
      symbol: this.defaultSymbol,
      activeStep: 0
    });
    onRequestClose();
  };

  handleInputImageChange = img => {
    this.updateSymbolProperty('img', img);
  };

  handleSymbolSearchChange = ({ img, label }) => {
    this.updateSymbolProperty('label', label);
    this.updateSymbolProperty('img', img);
  };

  handleSymbolSearchRequestClose = event => {
    this.setState({ isSymbolSearchOpen: false });
  };

  handleLabelChange = event => {
    this.updateSymbolProperty('label', event.target.value);
  };

  handleTextChange = (event, v, x) => {
    this.updateSymbolProperty('text', event.target.value);
  };

  handleTypeChange = (event, type) => {
    const boardId = type === 'folder' ? this.state.symbol.label : '';
    const symbol = { ...this.state.symbol, type, boardId };
    this.setState({ symbol });
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
    const currentLabel = this.currentSymbolProp('label')
      ? intl.formatMessage({ id: this.currentSymbolProp('label') })
      : '';

    const buttons = (
      <IconButton color="contrast" onClick={this.handleSearchClick}>
        <SearchIcon />
      </IconButton>
    );

    return (
      <div className="SymbolDetails">
        <FullScreenDialog
          disableSubmit={!currentLabel}
          buttons={buttons}
          open={open}
          title={
            <FormattedMessage
              {...(this.editingSymbol()
                ? messages.editSymbol
                : messages.addSymbol)}
            />
          }
          onRequestClose={this.handleCancel}
          onSubmit={this.handleSubmit}
        >
          <FullScreenDialogContent className="SymbolDetails__container">
            <div className="SymbolDetails__symbol">
              <InputImage
                label={intl.formatMessage(messages.uploadAnImage)}
                image={this.currentSymbolProp('img') || ''}
                onChange={this.handleInputImageChange}
              />
            </div>
            <div className="SymbolDetails__fields">
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
                value={this.currentSymbolProp('vocalization') || ''}
                onChange={this.handleTextChange}
                fullWidth
              />
              {!this.editingSymbol() && (
                <div className="SymbolDetails__radiogroup">
                  <FormControl>
                    <FormLabel>{intl.formatMessage(messages.type)}</FormLabel>
                    <RadioGroup
                      aria-label={intl.formatMessage(messages.type)}
                      name="type"
                      value={this.currentSymbolProp('type') || 'symbol'}
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

          {this.state.editingSymbols.length > 1 && (
            <MobileStepper
              type="progress"
              steps={this.state.editingSymbols.length}
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
                    this.state.editingSymbols.length - 1
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

const mapStateToProps = state => {
  return {};
};

export function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(SymbolDetails)
);
