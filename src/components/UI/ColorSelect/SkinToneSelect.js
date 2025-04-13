import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';

import IconButton from '../IconButton';
import Circle from './Circle';
import messages from './SkinTone.messages';

const skinToneSources = new Map([
  [
    'arasaac',
    [
      {
        name: 'white',
        color: '#f5e5de'
      },
      {
        name: 'black',
        color: '#a65c17'
      },
      {
        name: 'assian',
        color: '#f4ecad'
      },
      {
        name: 'mulatto',
        color: '#e3ab72'
      },
      {
        name: 'aztec',
        color: '#cf9d7c'
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

class SkinToneSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skinToneMenu: skinToneSources.has(props.source)
        ? skinToneSources.get(props.source)
        : skinToneSources.get('arasaac')
    };
  }

  render() {
    const { intl, onChange, selectedColor } = this.props;
    const skinToneLabel = intl.formatMessage(messages.skinTone);
    const radioGroupStyle = { flexDirection: 'row' };
    const radioItemStyle = { padding: '2px' };

    return (
      <FormControl className="ColorSelect">
        <label>{skinToneLabel}</label>
        <RadioGroup
          aria-label={skinToneLabel}
          name="skinTone"
          value={selectedColor}
          style={radioGroupStyle}
          onChange={onChange}
        >
          {this.state.skinToneMenu.map(skinTone => (
            <Radio
              key={skinTone.name}
              value={skinTone.name}
              style={radioItemStyle}
              icon={<Circle fill={skinTone.color} />}
              checkedIcon={
                <Circle fill={skinTone.color} color="primary" strokeWidth="3" />
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }
}

SkinToneSelect.propTypes = propTypes;
export default injectIntl(SkinToneSelect);
