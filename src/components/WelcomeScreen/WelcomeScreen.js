import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import MobileStepper from 'material-ui/MobileStepper';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Autosuggest from 'react-autosuggest';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';


// --- Auto suggestions  ---------------------------------------

const suggestions = [
  { label: 'Arabic' },
  { label: 'Czech' },
  { label: 'Danish' },
  { label: 'English' },
  { label: 'Hebrew' },

];

function renderInput(inputProps) {
  const { classes, home, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={home}
      className={classes.textField}
      value={value}
      inputRef={ref}
      fullWidth
      InputProps={{
        classes: {
          input: classes.input,

        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight
            ? <span key={index} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            : <strong key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>;
        })}
      </div>
    </MenuItem>

  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

const AutoSuggestionsStyles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 200,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
});

class IntegrationAutosuggest extends Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const classes = AutoSuggestionsStyles;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: true,
          classes,
          placeholder: 'Search a language (start with a)',
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};


// --- Radio Buttons ---------------------------------------

const RadioButtonsStyles = theme => ({
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class RadioButtonsGroup extends Component {
  state = {
    value: '',
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const classes = RadioButtonsStyles;

    return (
      <FormControl component="fieldset" required>
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          className={classes.group}
          value={this.state.value}
          onChange={this.handleChange}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
    );
  }
}

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};


// --- Login Form ---------------------------------------

const LoginFormStyles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    color:'red'
  },
  textField: {
    width: 200,
  }
};

class LoginForm extends Component {

  render() {

    const classes = LoginFormStyles;

    return (
      <div className={classes.AppBar}>

        <h1>
          Fill in the form below so we can give you a more personalized experience
        </h1>

        <TextField
          id="name"
          label="Name"
          className={classes.textField}
          margin="normal"
          fullWidth
        />
        <TextField
          id="age"
          type="number"
          label="Age"
          defaultValue=""
          className={classes.textField}
          margin="normal"
          fullWidth
        />
        <br/>
        <RadioButtonsGroup />
        <IntegrationAutosuggest />
      </div>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};


// --- Welcome Screen ---------------------------------------
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    color:'red'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

let myContnet = "";

class IntroText extends Component {
  render() {

    const classes = this.props.classes;

    return (
      <div>
        <h1 className={styles.introText}>Intro Text For Cboard will be here</h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </div>
    )
  }
}

IntroText.propTypes = {
  classes: PropTypes.object.isRequired,
};


class WelcomeScreen extends Component {
  state = {
    activeStep: 0,
  };


  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  render() {
    const classes = this.props.classes;
    if (this.state.activeStep == 0) {
      myContnet = <IntroText/>;
    }else if (this.state.activeStep == 1){
      myContnet = <LoginForm/>;
    }
    return (
      <div className={classes.root}>


        <Paper square elevation={2} className={classes.header}>
          <Typography>
            {myContnet}
          </Typography>
        </Paper>
        <MobileStepper
          type="text"
          steps={2}
          position="static"
          activeStep={this.state.activeStep}
          className={classes.mobileStepper}
          onBack={this.handleBack}
          onNext={this.handleNext}
          disableBack={this.state.activeStep === 0}
          disableNext={this.state.activeStep === 1}
        />
      </div>
    );
  }
}

WelcomeScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(LoginFormStyles)(WelcomeScreen);