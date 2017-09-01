import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import TextField from 'material-ui/TextField';
import MobileStepper from 'material-ui/MobileStepper';

import messages from './messages';
import SymbolSearch from '../SymbolSearch';
import FullScreenDialog from '../../../components/FullScreenDialog';
import InputImage from '../../../components/InputImage';

import './SymbolDetails.css';

export class SymbolDetails extends Component {
  constructor(props) {
    super(props);

    this.defaultSymbol = {
      type: 'symbol',
      label: '',
      text: '',
      img: '',
      boardId: ''
    };

    this.state = {
      symbol: this.defaultSymbol,
      editingSymbols: props.editingSymbols,
      activeStep: 0
    };
  }

  componentWillReceiveProps = props => {
    this.setState({ editingSymbols: props.editingSymbols });
  };

  editingSymbol = () => this.state.editingSymbols[this.state.activeStep];

  currentSymbolProp = prop => {
    const currentSymbol = this.editingSymbol();
    return currentSymbol ? currentSymbol[prop] : this.state.symbol[prop];
  };

  updateEditingSymbol = (id, property, value) => state => {
    const editingSymbols = state.editingSymbols.map(
      s => (s.id === id ? { ...s, ...{ [property]: value } } : s)
    );
    return { ...state, editingSymbols };
  };

  updateNewSymbol = (property, value) => state => {
    const symbol = Object.assign({}, state.symbol, { [property]: value });
    return { ...state, symbol };
  };

  updateSymbolProperty = (property, value) => {
    if (this.editingSymbol()) {
      this.setState(
        this.updateEditingSymbol(this.editingSymbol().id, property, value)
      );
    } else {
      this.setState(this.updateNewSymbol(property, value));
    }
  };

  handleSubmit = () => {
    const { onEditSubmit, onAddSubmit } = this.props;
    if (this.editingSymbol()) {
      onEditSubmit(this.state.editingSymbols);
    } else {
      onAddSubmit(this.state.symbol);
    }
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      symbol: this.defaultSymbol
    });
    onCancel();
  };

  handleInputImageChange = img => {
    this.updateSymbolProperty('img', img);
  };

  handleSymbolSearchChange = ({ img, label }) => {
    this.updateSymbolProperty('label', label);
    this.updateSymbolProperty('img', img);
  };

  handleLabelChange = event => {
    this.updateSymbolProperty('label', event.target.value);
  };

  handleTextChange = (event, v, x) => {
    this.updateSymbolProperty('text', event.target.value);
  };

  handleTypeChange = (event, type) => {
    const boardId = type === 'folder' ? this.state.symbol.label : '';
    const symbol = Object.assign({}, this.state.symbol, { type, boardId });
    this.setState({ symbol });
  };

  handleBack = event => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleNext = event => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  render() {
    const { open, intl } = this.props;
    const currentLabel = this.currentSymbolProp('label')
      ? intl.formatMessage({ id: this.currentSymbolProp('label') })
      : '';

    return (
      <div className="SymbolDetails">
        <FullScreenDialog
          open={open}
          title={
            <FormattedMessage
              {...(this.editingSymbol()
                ? messages.editSymbol
                : messages.addSymbol)}
            />
          }
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
        >
          <div className="SymbolDetails__container">
            <div className="SymbolDetails__content">
              <SymbolSearch onChange={this.handleSymbolSearchChange} />
              <div className="SymbolDetails__symbol">
                <InputImage
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
                />

                <TextField
                  id="text"
                  label={intl.formatMessage(messages.text)}
                  value={this.currentSymbolProp('text') || ''}
                  onChange={this.handleTextChange}
                  fullWidth
                />
                {!this.editingSymbol() &&
                  <FormControl required>
                    <FormLabel>
                      {intl.formatMessage(messages.type)}
                    </FormLabel>
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
                  </FormControl>}
              </div>
            </div>
            {this.state.editingSymbols.length > 1 &&
              <MobileStepper
                className="SymbolDetails__stepper"
                type="progress"
                steps={this.state.editingSymbols.length}
                position="static"
                activeStep={this.state.activeStep}
                onBack={this.handleBack}
                onNext={this.handleNext}
                disableBack={this.state.activeStep === 0}
                disableNext={
                  this.state.activeStep === this.state.editingSymbols.length - 1
                }
                backButtonText={intl.formatMessage(messages.back)}
                nextButtonText={intl.formatMessage(messages.next)}
              />}
          </div>
        </FullScreenDialog>
      </div>
    );
  }
}

SymbolDetails.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  editingSymbol: PropTypes.array
};

SymbolDetails.defaultProps = {
  editingSymbols: []
};

const mapStateToProps = state => {
  return {};
};

export function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(SymbolDetails)
);
