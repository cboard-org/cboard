import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Subscribe.messages';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import '../Settings.css';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when clicking the subscribe button
   */
  subscribe: PropTypes.func.isRequired,
  /**
   * flag for user
   */
  isLogged: PropTypes.bool.isRequired,
  /**
   * Name of user
   */
  name: PropTypes.string.isRequired,
  /**
   * User email
   */
  email: PropTypes.string.isRequired
};

const defaultProps = {
  name: '',
  email: '',
  location: { country: null, countryCode: null }
};

const Subscribe = ({
  onClose,
  isLogged,
  subscribe,
  name,
  email,
  location: { country, countryCode },
  onSubmitPeople
}) => {
  return (
    <div className="Subscribe">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.subscribe} />}
        onClose={onClose}
      >
        <Paper>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 19 }}
                color="text.secondary"
                gutterBottom
              >
                One Year Subscription
              </Typography>
              <Typography variant="h3" component="div">
                $69 / year
              </Typography>
              <Button
                variant="contained"
                fullWidth={true}
                color="primary"
                onClick={subscribe}
              >
                <FormattedMessage {...messages.subscribe} />
              </Button>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <br />
                <br />
                Included Features:
                <br />
                <br />
              </Typography>
              <Typography variant="body2">
                » Online neural voices
                <br />
                <br />
                » Advanced board edition controls
                <br />
                <br />
                » Copy public boards
                <br />
                <br />
                » Share phrases or boards
                <br />
                <br />» Powerful usage analytics
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Paper>
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
