import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, Select } from '@material-ui/core';
import IconButton from '../IconButton';
import Circle from './Circle';
import messages from './ColorSelect.messages';
import { HuePicker } from 'react-color';

const colorSchemes = [
  {
    name: 'Cboard',
    colors: ['#bbdefb', '#fff176', '#CE93D8', '#2196F3', '#4CAF50', '#E57373']
  },
  {
    name: 'Fitzgerald',
    colors: [
      '#2196F3',
      '#4CAF50',
      '#fff176',
      '#ff6600',
      '#ffffff',
      '#ffc0cb',
      '#800080',
      '#a52a2a',
      '#ff0000',
      '#808080'
    ]
  },
  {
    name: 'Goossens',
    colors: ['#ffc0cb', '#2196F3', '#4CAF50', '#fff176', '#ff6600']
  },
  {
    name: 'Custom',
    colors: []
  }
];

const propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  defaultColor: PropTypes.string.isRequired
};

class ColorSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colorMenu: colorSchemes[0]
    };
  }

  handleColorSchemeChange = event => {
    const selectedScheme = event.target.value;
    this.setState({ colorMenu: selectedScheme });
  };

  handleHueChange = hue => {
    this.props.onChange({ target: { value: hue.hex } });
  };

  handleRadioItemChange = event => {
    const selectedColor = event.target.value;
    this.props.onChange({ target: { value: selectedColor } });
  };

  render() {
    const { intl, onChange, selectedColor, defaultColor } = this.props;
    const colorLabel = intl.formatMessage(messages.color);
    const radioGroupStyle = { flexDirection: 'row' };
    const radioItemStyle = { padding: '2px' };
    const hueItemStyle = { marginTop: '5px' };

    return (
      <FormControl className="ColorSelect">
        <div>
          <FormControl fullWidth id="color-scheme-menu">
            <InputLabel id="color-scheme-menu-label">
              {intl.formatMessage(messages.colorScheme)}
            </InputLabel>
            <Select
              id="color-scheme"
              labelId="color-scheme-menu-label"
              value={this.state.colorMenu}
              onChange={this.handleColorSchemeChange}
            >
              {colorSchemes.map((scheme, index) => (
                <MenuItem key={index} value={scheme}>
                  {scheme.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <RadioGroup
          aria-label={colorLabel}
          name="color"
          value={selectedColor}
          style={radioGroupStyle}
          onChange={this.handleRadioItemChange}
        >
          {this.state.colorMenu.name === 'Custom' ? (
            <div style={hueItemStyle}>
              <HuePicker
                color={selectedColor}
                onChange={this.handleHueChange}
              />
            </div>
          ) : (
            this.state.colorMenu.colors?.map(color => (
              <Radio
                key={color}
                value={color}
                style={radioItemStyle}
                icon={<Circle fill={color} />}
                checkedIcon={<Circle fill={color} />}
              />
            ))
          )}
          {defaultColor !== selectedColor && (
            <IconButton
              label={intl.formatMessage(messages.clearSelection)}
              onClick={() => {
                onChange({ target: { value: defaultColor } });
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </RadioGroup>
      </FormControl>
    );
  }
}

ColorSelect.propTypes = propTypes;
export default injectIntl(ColorSelect);
