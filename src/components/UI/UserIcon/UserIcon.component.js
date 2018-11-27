import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';

import AccountIcon from '@material-ui/icons/AccountCircle';

import IconButton from '../IconButton';
import messages from './UserIcon.messages';

const propTypes = {
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  user: PropTypes.object
};

const styles = {
  greenAvatar: {
    backgroundColor: green[500]
  }
};

export const UserIcon = ({ intl, user, classes }) => {
  let avatar = null;
  if (user) {
    const [first, second = ''] = user.name
      .toUpperCase()
      .split(' ')
      .slice(0, 2);
    avatar = `${first.slice(0, 1)}${second.slice(0, 1)}`;
  }

  return (
    <IconButton label={user ? user.name : intl.formatMessage(messages.login)}>
      <React.Fragment>
        {!user && (
          <Link to="/login-signup" className="LoginSignUpButton">
            <AccountIcon />
          </Link>
        )}
        {!!user && (
          <Avatar className={`UserIcon__Avatar ${classes.greenAvatar}`}>
            {avatar}
          </Avatar>
        )}
      </React.Fragment>
    </IconButton>
  );
};

UserIcon.propTypes = propTypes;

export default withStyles(styles)(injectIntl(UserIcon));
