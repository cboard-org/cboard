# Copilot Instructions for Cboard

## Project Overview
Cboard is an augmentative and alternative communication (AAC) web application that helps users with speech and language impairments communicate using symbols and text-to-speech.

## Technological Stack
- React 17
- Material UI v4
- Redux for state management with redux-thunk
- React-Intl for internationalization
- Jest and Enzyme for testing
- Formik and Yup for form handling and validation
- Webpack (via CRACO)

## Project Structure
- Components follow a specific structure:
  - `Component/Component.component.js`: Main component implementation
  - `Component/Component.container.js`: Container with Redux connections
  - `Component/Component.messages.js`: Internationalization messages
  - `Component/Component.css`: Component-specific styles (when not using Material-UI styles)
  - `Component/index.js`: Re-exports the container or component
  - `Component/__tests__/Component.test.js`: Tests for the component

## Component Guidelines

### React Components
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

// For functional components with Hooks:
const useStyles = makeStyles(theme => ({
  root: {
    // styles here
  }
}));

// Function Component
function ComponentName(props) {
  const classes = useStyles();
  
  // Component logic here
  
  return (
    <div className={classes.root}>
      {/* JSX here */}
    </div>
  );
}

ComponentName.propTypes = {
  // Define prop types here
};

ComponentName.defaultProps = {
  // Define default props here
};

export default ComponentName;
```

### Container Pattern
```jsx
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ComponentName from './ComponentName.component';
import { actionCreator } from './ComponentName.actions';

const mapStateToProps = state => ({
  // Map state to props here
});

const mapDispatchToProps = {
  // Map action creators here
  actionName: actionCreator
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ComponentName));
```

## Redux Guidelines

### Action Types and Constants
```jsx
// ComponentName.constants.js
export const ACTION_TYPE = 'cboard/ComponentName/ACTION_TYPE';
```

### Action Creators
```jsx
// ComponentName.actions.js
import { ACTION_TYPE } from './ComponentName.constants';
import API from '../../api';

export function actionName(payload) {
  return {
    type: ACTION_TYPE,
    payload
  };
}

export function asyncActionName(payload) {
  return async dispatch => {
    try {
      const data = await API.methodName(payload);
      dispatch(actionName(data));
    } catch (error) {
      // Handle error
    }
  };
}
```

### Reducers
```jsx
// ComponentName.reducer.js
import { ACTION_TYPE } from './ComponentName.constants';

const initialState = {
  // Define initial state here
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPE:
      return {
        ...state,
        // Update state based on action
      };
    default:
      return state;
  }
}

export default reducer;
```

## Internationalization

### Messages
```jsx
// ComponentName.messages.js
import { defineMessages } from 'react-intl';

export default defineMessages({
  messageKey: {
    id: 'cboard.components.ComponentName.messageKey',
    defaultMessage: 'Default message in English'
  }
});
```

### Usage in Components
```jsx
import { FormattedMessage, useIntl } from 'react-intl';
import messages from './ComponentName.messages';

// In JSX:
<FormattedMessage {...messages.messageKey} />

// Or with useIntl hook:
const intl = useIntl();
intl.formatMessage(messages.messageKey)
```

## Testing Guidelines

```jsx
import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ComponentName } from './ComponentName.component';

describe('<ComponentName />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ComponentName />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('performs expected behavior', () => {
    // Test component behavior
  });
});
```

## Common UI Patterns

### Dialog Component
```jsx
<Dialog open={isOpen} onClose={handleClose}>
  <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
  <DialogContent>
    <DialogContentText>{intl.formatMessage(messages.content)}</DialogContentText>
    {/* Form elements or content here */}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      <FormattedMessage {...messages.cancel} />
    </Button>
    <Button onClick={handleSubmit} color="primary" variant="contained">
      <FormattedMessage {...messages.confirm} />
    </Button>
  </DialogActions>
</Dialog>
```

### Form Dialog Component
```jsx
<FormDialog
  open={isOpen}
  title={<FormattedMessage {...messages.title} />}
  onSubmit={handleSubmit}
  onClose={handleClose}
>
  <TextField
    autoFocus
    margin="dense"
    id="name"
    label={intl.formatMessage(messages.fieldLabel)}
    value={value}
    onChange={handleChange}
    fullWidth
  />
</FormDialog>
```

### Settings Menu Item
```jsx
<ListItem>
  <ListItemText
    primary={<FormattedMessage {...messages.settingName} />}
    secondary={<FormattedMessage {...messages.settingDescription} />}
  />
  <ListItemSecondaryAction>
    <Switch
      checked={isEnabled}
      onChange={handleToggle}
      value="active"
      color="secondary"
    />
  </ListItemSecondaryAction>
</ListItem>
<Divider />
```

### Icon Button
```jsx
<IconButton
  label={intl.formatMessage(messages.buttonLabel)}
  onClick={handleClick}
  disabled={disabled}
>
  <SomeIcon />
</IconButton>
```

### Full Screen Dialog
```jsx
<FullScreenDialog
  open={isOpen}
  title={<FormattedMessage {...messages.title} />}
  onClose={handleClose}
  onSubmit={handleSubmit}
>
  <Paper>
    <FullScreenDialogContent>
      {/* Content here */}
    </FullScreenDialogContent>
  </Paper>
</FullScreenDialog>
```

### Select Component
```jsx
<FormControl>
  <InputLabel id="select-label">{intl.formatMessage(messages.selectLabel)}</InputLabel>
  <Select
    labelId="select-label"
    id="select"
    value={value}
    onChange={handleChange}
  >
    {options.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

### Card Component
```jsx
<Card onClick={handleClick} raised={isHighlighted}>
  <CardMedia
    component="img"
    height="140"
    image={imageUrl}
    alt={imageAlt}
  />
  <CardContent>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2" color="textSecondary">
      {description}
    </Typography>
  </CardContent>
</Card>
```

### Premium Feature Wrapper
```jsx
<PremiumFeature isLoginRequired={requiresLogin}>
  {/* Wrapped component or element */}
  <Button onClick={handleClick} color="primary" variant="contained">
    <FormattedMessage {...messages.premiumAction} />
  </Button>
</PremiumFeature>
```
