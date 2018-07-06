import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';

import IconButton from '../IconButton';
import Circle from './Circle';
import messages from './ColorSelect.messages';

const propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string
};

const defaultProps = {
  colors: ['#CE93D8', '#2196F3', '#4CAF50', '#E57373']
};

const ColorSelect = props => {
  const { colors, intl, onChange, selectedColor } = props;

  const colorLabel = intl.formatMessage(messages.color);
  const radioGroupStyle = { flexDirection: 'row' };
  const circleStrokeWidth = 2;

  return (
    <FormControl className="ColorSelect">
      <FormLabel>{colorLabel}</FormLabel>
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
ColorSelect.defaultProps = defaultProps;

export default injectIntl(ColorSelect);
