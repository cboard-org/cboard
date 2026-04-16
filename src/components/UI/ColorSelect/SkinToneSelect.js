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

const propTypes = {
  source: PropTypes.string,
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

const defaultProps = {
  source: 'arasaac',
  disabled: false
};

class SkinToneSelect extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      open: false,
      skinToneMenu: skinToneSources.has(props.source)
        ? skinToneSources.get(props.source)
        : skinToneSources.get('arasaac')
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleChange = event => {
    const { onChange } = this.props;

    onChange(event);
    this.setState({
      open: false
    });
  };

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({
        open: false
      });
    }
  };

  toggleOpen() {
    if (this.props.disabled) return;
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { intl, selectedColor, disabled } = this.props;
    const skinToneLabel = intl.formatMessage(messages.skinTone);
    const radioGroupStyle = { flexDirection: 'column' };
    const radioItemStyle = { padding: '2px' };

    return (
      <div
        id="SkinToneOptions"
        className="colorSelectDropdown"
        ref={this.wrapperRef}
      >
        <Tooltip
          title={
            disabled
              ? intl.formatMessage(messages.skinToneDisabled)
              : skinToneLabel
          }
          aria-label={
            disabled
              ? intl.formatMessage(messages.skinToneDisabled)
              : skinToneLabel
          }
        >
          <span>
            <IconButton
              label={skinToneLabel}
              onClick={() => this.toggleOpen()}
              style={{ color: disabled ? '' : 'inherit' }}
              disabled={disabled}
            >
              <PanTool />
            </IconButton>
          </span>
        </Tooltip>
        <FormControl className="colorSelectDropdown-options">
          <Card className={this.state.open ? 'opened' : 'closed'}>
            <CardContent>
              <RadioGroup
                aria-label={skinToneLabel}
                name="skinTone"
                value={selectedColor}
                style={radioGroupStyle}
                onChange={this.handleChange}
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
SkinToneSelect.defaultProps = defaultProps;
export default injectIntl(SkinToneSelect);
