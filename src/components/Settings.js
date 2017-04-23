import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
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
      <div className="settings__content">
        <h2>Text-to-speech</h2>
        <SelectField
          value={selectedLanguage}
          onChange={onLanguageToggle}
          fullWidth
          maxHeight={200}
        >
          {languageMenuItems}
        </SelectField>
        <p>Pitch</p>
        <Slider name="pitch" defaultValue={1} step={0.1} min={0} max={2} />

        <p>Rate</p>
        <Slider name="rate" defaultValue={1} step={0.1} min={0} max={2} />
        <h2>Profile</h2>
        <p>Gender</p>
        <RadioButtonGroup name="gender" defaultSelected="male">
          <RadioButton
            value="male"
            label="Male"
          />
          <RadioButton
            value="female"
            label="Female"
          />
        </RadioButtonGroup>
      </div>
    </div >
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
