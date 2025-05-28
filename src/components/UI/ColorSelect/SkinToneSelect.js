import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import { Card, CardContent, IconButton, Tooltip } from '@material-ui/core';
import { PanTool } from '@material-ui/icons';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import './ColorSelectDropdown.css';
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
const sourcesNames = new Map([['arasaac', 'ARASAAC']]);

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
      open: false,
      sourceName: sourcesNames.has(props.source)
        ? sourcesNames.get(props.source)
        : sourcesNames.get('arasaac'),
      skinToneMenu: skinToneSources.has(props.source)
        ? skinToneSources.get(props.source)
        : skinToneSources.get('arasaac')
    };
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { intl, onChange, selectedColor, iconColor } = this.props;
    const skinToneLabel = `${this.state.sourceName} ${intl.formatMessage(
      messages.skinTone
    )}`;
    const radioGroupStyle = { flexDirection: 'column' };
    const radioItemStyle = { padding: '2px' };

    return (
      <div className="colorSelectDropdown">
        <Tooltip title={skinToneLabel} aria-label={skinToneLabel}>
          <IconButton
            label={skinToneLabel}
            onClick={() => this.toggleOpen()}
            style={{ color: iconColor ? iconColor : 'inherit' }}
          >
            <PanTool />
          </IconButton>
        </Tooltip>
        <FormControl className="colorSelectDropdown-options">
          <Card className={this.state.open ? 'opened' : 'closed'}>
            <CardContent>
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
                      <Circle
                        fill={skinTone.color}
                        color="primary"
                        strokeWidth={3}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </FormControl>
      </div>
    );
  }
}

SkinToneSelect.propTypes = propTypes;
export default injectIntl(SkinToneSelect);
