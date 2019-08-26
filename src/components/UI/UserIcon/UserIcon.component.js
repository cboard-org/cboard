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
  user: PropTypes.object,
  link: PropTypes.bool,
  accountIcon: PropTypes.any
};

const styles = {
  greenAvatar: {
    backgroundColor: green[500]
  }
};

export const UserIcon = ({
  intl,
  user,
  classes,
  link = true,
  accountIcon = AccountIcon,
  ...other
}) => {
  let avatar = null;
  let hasPhotos = false;
  if (user) {
    const fPhotos =
      user.facebook && user.facebook.photos && user.facebook.photos.length
        ? user.facebook.photos
        : null;
    const gPhotos =
      user.google && user.google.photos && user.google.photos.length
        ? user.google.photos
        : null;
    const uPhotos = user.photos && user.photos.length ? user.photos : null;
    const photos = uPhotos || fPhotos || gPhotos || [];

    if (photos.length) {
      hasPhotos = true;
      avatar = photos[0];
    } else {
      const [first, second = ''] = user.name
        .toUpperCase()
        .split(' ')
        .slice(0, 2);
      avatar = `${first.slice(0, 1)}${second.slice(0, 1)}`;
    }
  }

  const AccountIconToRender = accountIcon;

  return (
    <IconButton
      label={user ? user.name : intl.formatMessage(messages.login)} {...other}
    >
      <React.Fragment>
        {!user && link && (
          <Link to="/login-signup" className="LoginSignUpButton">
            <AccountIconToRender />
          </Link>
        )}
        {!user && !link && (
          <Avatar>
            <AccountIconToRender />
          </Avatar>
        )}
        {!!user && (
          <Avatar className={`UserIcon__Avatar ${classes.greenAvatar}`}>
            {!hasPhotos && avatar}
            {hasPhotos && <img src={avatar} alt={user.name} />}
          </Avatar>
        )}
      </React.Fragment>
    </IconButton>
  );
};

UserIcon.propTypes = propTypes;

export default withStyles(styles)(injectIntl(UserIcon));
