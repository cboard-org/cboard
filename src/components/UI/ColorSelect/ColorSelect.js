import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '../IconButton';
import Circle from './Circle';
import messages from './ColorSelect.messages';

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
  }
];

const propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired
};

class ColorSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colorMenu: null,
      colors: colorSchemes[0].colors
    };
  }
  handleOpenColorSchemeMenu(event) {
    this.setState({ colorMenu: event.currentTarget });
  }
  handleColorSchemeClose(colorScheme) {
    this.setState({ colors: colorScheme.colors, colorMenu: null });
  }

  render() {
    const { intl, onChange, selectedColor } = this.props;
    const colorLabel = intl.formatMessage(messages.color);
    const radioGroupStyle = { flexDirection: 'row' };
    const radioItemStyle = { padding: '4px' };
    const circleStrokeWidth = 2;

    return (
      <FormControl className="ColorSelect">
        <FormLabel>{colorLabel}</FormLabel>
        <div>
          <Button
            aria-controls="color-scheme-menu"
            aria-haspopup="true"
            onClick={this.handleOpenColorSchemeMenu.bind(this)}
          >
            {intl.formatMessage(messages.colorScheme)}
          </Button>
          <Menu
            id="color-scheme"
            keepMounted
            anchorEl={this.state.colorMenu}
            open={Boolean(this.state.colorMenu)}
            onClose={this.handleColorSchemeClose.bind(this)}
          >
            <MenuItem
              onClick={this.handleColorSchemeClose.bind(this, colorSchemes[0])}
            >
              {colorSchemes[0].name}
            </MenuItem>
            <MenuItem
              onClick={this.handleColorSchemeClose.bind(this, colorSchemes[1])}
            >
              {colorSchemes[1].name}
            </MenuItem>
            <MenuItem
              onClick={this.handleColorSchemeClose.bind(this, colorSchemes[2])}
            >
              {colorSchemes[2].name}
            </MenuItem>
          </Menu>
        </div>
        <RadioGroup
          aria-label={colorLabel}
          name="color"
          value={selectedColor}
          style={radioGroupStyle}
          onChange={onChange}
        >
          {this.state.colors.map(color => (
            <Radio
              key={color}
              value={color}
              style={radioItemStyle}
              icon={<Circle fill={color} />}
              checkedIcon={
                <Circle fill={color} strokeWidth={circleStrokeWidth} />
              }
            />
          ))}
          {selectedColor && (
            <IconButton
              label={intl.formatMessage(messages.clearSelection)}
              onClick={() => {
                onChange();
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
