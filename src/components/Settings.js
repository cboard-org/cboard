import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import AppBar from 'material-ui/AppBar';
import '../styles/Settings.css';

function Settings({ supportedVoices, selectedLanguage, onLanguageToggle }) {
  const languageMenuItems = supportedVoices.map((voice, index) => (
    <MenuItem key={index} value={voice.lang} primaryText={voice.text} />
  ));

  return (
    <div className="settings">
      <AppBar
        title="Settings"
        showMenuIconButton={false}
      />
      <SelectField
        floatingLabelText="Voices"
        value={selectedLanguage}
        onChange={onLanguageToggle}
      >
        {languageMenuItems}
      </SelectField>
    </div>
  );
}

Settings.propTypes = {
  onLanguageToggle: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string,
  supportedVoices: PropTypes.array,
};

Settings.defaultProps = {
  selectedLanguage: 'en-US',
  supportedVoices: [],
};

export default Settings;
