import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

import SymbolSearch from '../SymbolSearch';
import messages from './messages';
import FullScreenDialog from '../../../components/FullScreenDialog';
import InputImage from '../../../components/InputImage';

export class SymbolDetails extends Component {
  constructor(props) {
    super(props);

    const { type, label, text, img, boardId } = props.symbol;

    this.state = {
      symbol: {
        type,
        label,
        text,
        img,
        boardId
      }
    };
  }

  handleSubmit = symbol => {
    const { onSubmit } = this.props;
    onSubmit(symbol);
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  handleInputImageChange = img => {
    const symbol = Object.assign({}, this.state.symbol, { img });
    this.setState({ symbol });
  };

  handleSymbolSearchChange = ({ img, label }) => {
    const symbol = Object.assign({}, this.state.symbol, { img, label });
    this.setState({ symbol });
  };

  handleLabelChange = event => {
    const symbol = Object.assign({}, this.state.symbol, {
      label: event.target.value
    });
    this.setState({ symbol });
  };

  handleTextChange = event => {
    const symbol = Object.assign({}, this.state.symbol, {
      text: event.target.value
    });
    this.setState({ symbol });
  };

  handleTypeChange = (event, type) => {
    const boardId = type === 'folder' ? this.state.symbol.label : '';
    const symbol = Object.assign({}, this.state.symbol, { type, boardId });
    this.setState({ symbol });
  };

  render() {
    const { open, onCancel } = this.props;

    return (
      <div className="SymbolDetails">
        <FullScreenDialog
          open={open}
          title={<FormattedMessage {...messages.addSymbol} />}
          onCancel={onCancel}
          onSubmit={() => {
            this.handleSubmit(this.state.symbol);
          }}
        >
          <SymbolSearch onChange={this.handleSymbolSearchChange} />
          <div className="SymbolDetails__symbol">
            <InputImage
              image={this.state.symbol.img}
              onChange={this.handleInputImageChange}
            />
          </div>
          <div className="SymbolDetails__fields">
            <TextField
              id="label"
              label="Label"
              value={this.state.symbol.label}
              onChange={this.handleLabelChange}
              fullWidth
            />

            <TextField
              id="text"
              label="Text"
              value={this.state.symbol.text}
              onChange={this.handleTextChange}
              fullWidth
            />
            <FormControl required>
              <FormLabel>Type</FormLabel>
              <RadioGroup
                aria-label="type"
                name="type"
                selectedValue={this.state.symbol.type}
                onChange={this.handleTypeChange}
              >
                <FormControlLabel
                  value="symbol"
                  control={<Radio />}
                  label="Symbol"
                />
                <FormControlLabel
                  value="folder"
                  control={<Radio />}
                  label="Folder"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </FullScreenDialog>
      </div>
    );
  }
}

SymbolDetails.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  symbol: PropTypes.object
};

SymbolDetails.defaultProps = {
  symbol: {
    type: 'symbol'
  }
};

const mapStateToProps = state => {
  return {
    selectedSymbols: state.board.selectedSymbols
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    changeSymbols: symbols => {
      // dispatch(changeSymbols(symbols));
    },
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(SymbolDetails)
);
