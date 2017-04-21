import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Settings extends PureComponent {

  render() {
    const languageMenuItems = this.props.supportedVoices.map((voice, index) => {
      return <MenuItem key={index} value={voice.lang} primaryText={voice.text} />;
    });

    return (
      <div className="settings">
        <SelectField
          floatingLabelText="Voices"
          value={this.props.selectedLanguage}
          onChange={this.props.onLanguageToggle}
        >
          {languageMenuItems}
        </SelectField>
      </div>
    );
  }
}

Settings.propTypes = {
  onLanguageToggle: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string,
  supportedVoices: PropTypes.array,
}

Settings.defaultProps = {
  selectedLanguage: 'en-US',
  supportedVoices: []
}

export default Settings;
