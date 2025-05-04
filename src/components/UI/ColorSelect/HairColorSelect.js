import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Circle from './Circle';
import messages from './HairColor.messages';

const hairColorSources = new Map([
  [
    'arasaac',
    [
      {
        name: 'blonde',
        color: '#fdd700'
      },
      {
        name: 'brown',
        color: '#a65e26'
      },
      {
        name: 'darkBrown',
        color: '#6a2703'
      },
      {
        name: 'gray',
        color: '#efefef'
      },
      {
        name: 'darkGray',
        color: '#aaabab'
      },
      {
        name: 'red',
        color: '#ed4120'
      },
      {
        name: 'black',
        color: '#020100'
      }
    ]
  ]
]);

const propTypes = {
  source: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired
};

class HairColorSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hairColorMenu: hairColorSources.has(props.source)
        ? hairColorSources.get(props.source)
        : hairColorSources.get('arasaac')
    };
  }

  render() {
    const { intl, onChange, selectedColor } = this.props;
    const hairColorLabel = intl.formatMessage(messages.hairColor);
    const radioGroupStyle = { flexDirection: 'row' };
    const radioItemStyle = { padding: '2px' };

    return (
      <FormControl className="ColorSelect">
        <label>{hairColorLabel}</label>
        <RadioGroup
          aria-label={hairColorLabel}
          name="hairColor"
          value={selectedColor}
          style={radioGroupStyle}
          onChange={onChange}
        >
          {this.state.hairColorMenu.map(hairColor => (
            <Radio
              key={hairColor.name}
              value={hairColor.name}
              style={radioItemStyle}
              icon={<Circle fill={hairColor.color} />}
              checkedIcon={
                <Circle
                  fill={hairColor.color}
                  color="primary"
                  strokeWidth={3}
                />
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }
}

HairColorSelect.propTypes = propTypes;
export default injectIntl(HairColorSelect);
