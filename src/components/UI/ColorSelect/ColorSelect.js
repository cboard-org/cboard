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
    name: 'default',
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

const ColorSelect = props => {
  const { intl, onChange, selectedColor } = props;
  var colors = colorSchemes[0].colors;

  const colorLabel = intl.formatMessage(messages.color);
  const radioGroupStyle = { flexDirection: 'row' };
  const circleStrokeWidth = 2;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenColorSchemeMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorSchemeClose = colorScheme => {
    setAnchorEl(null);
  };

  return (
    <FormControl className="ColorSelect">
      <FormLabel>{colorLabel}</FormLabel>
      <div>
        <Button
          aria-controls="color-scheme-menu"
          aria-haspopup="true"
          onClick={handleOpenColorSchemeMenu}
        >
          {intl.formatMessage(messages.colorScheme)}
        </Button>
        <Menu
          id="color-scheme"
          keepMounted
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleColorSchemeClose}
        >
          <MenuItem onClick={handleColorSchemeClose}>
            {colorSchemes[1].name}
          </MenuItem>
          <MenuItem onClick={handleColorSchemeClose}>
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
        {colors.map(color => (
          <Radio
            key={color}
            value={color}
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
};

ColorSelect.propTypes = propTypes;
export default injectIntl(ColorSelect);
