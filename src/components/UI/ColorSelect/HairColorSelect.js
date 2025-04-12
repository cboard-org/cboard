import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';

import IconButton from '../IconButton';
import Circle from './Circle';
import messages from './HairColor.messages';

const hairColorSources = new Map([
  [
    'arasaac',
    [
      {
        name: 'blonde',
        color: '#FDD700'
      },
      {
        name: 'brown',
        color: '#A65E26'
      },
      {
        name: 'darkBrown',
        color: '#6A2703'
      },
      {
        name: 'gray',
        color: '#EFEFEF'
      },
      {
        name: 'darkGray',
        color: '#AAABAB'
      },
      {
        name: 'red',
        color: '#ED4120'
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
              value={hairColor.color}
              style={radioItemStyle}
              icon={<Circle color={hairColor.color} />}
              checkedIcon={<Circle color={hairColor.color} />}
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

HairColorSelect.propTypes = propTypes;
export default injectIntl(HairColorSelect);
