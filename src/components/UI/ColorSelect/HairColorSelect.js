import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import { Card, CardContent, IconButton, Tooltip } from '@material-ui/core';
import { Face } from '@material-ui/icons';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import './ColorSelectDropdown.css';
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
const sourcesNames = new Map([['arasaac', 'ARASAAC']]);

const propTypes = {
  source: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired
};

class HairColorSelect extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      open: false,
      sourceName: sourcesNames.has(props.source)
        ? sourcesNames.get(props.source)
        : sourcesNames.get('arasaac'),
      hairColorMenu: hairColorSources.has(props.source)
        ? hairColorSources.get(props.source)
        : hairColorSources.get('arasaac')
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
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { intl, onChange, selectedColor, iconColor } = this.props;
    const hairColorLabel = `${this.state.sourceName} ${intl.formatMessage(
      messages.hairColor
    )}`;
    const radioGroupStyle = { flexDirection: 'column' };
    const radioItemStyle = { padding: '2px' };

    return (
      <div className="colorSelectDropdown" ref={this.wrapperRef}>
        <Tooltip title={hairColorLabel} aria-label={hairColorLabel}>
          <IconButton
            label={hairColorLabel}
            onClick={() => this.toggleOpen()}
            style={{ color: iconColor ? iconColor : 'inherit' }}
          >
            <Face />
          </IconButton>
        </Tooltip>
        <FormControl className="colorSelectDropdown-options">
          <Card className={this.state.open ? 'opened' : 'closed'}>
            <CardContent>
              <RadioGroup
                aria-label={hairColorLabel}
                name="hairColor"
                value={selectedColor}
                style={radioGroupStyle}
                onChange={this.handleChange}
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
            </CardContent>
          </Card>
        </FormControl>
      </div>
    );
  }
}

HairColorSelect.propTypes = propTypes;
export default injectIntl(HairColorSelect);
