import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import './SignUp.css';

class SignUp extends PureComponent {
  state = {
    name: '',
    age: 0,
    gender: ''
  };

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleAgeChange = event => {
    this.setState({ age: event.target.value });
  };

  handleGenderChange = (event, gender) => {
    this.setState({ gender });
  };

  render() {
    return (
      <div className="SignUp">
        <h1 className="SignUp__heading">Sign Up</h1>
        <div className="SignUp__content">
          <TextField
            id="name"
            label="Name"
            margin="normal"
            fullWidth
            onChange={this.handleNameChange}
          />
          <TextField
            id="age"
            type="number"
            label="Age"
            margin="normal"
            fullWidth
            onChange={this.handleAgeChange}
          />
          <FormControl component="fieldset" required>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={this.state.gender}
              onChange={this.handleGenderChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    );
  }
}

export default SignUp;
