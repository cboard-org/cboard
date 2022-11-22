import React from 'react';
import Grid from '@material-ui/core/Grid';
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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Subscribe.messages';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import '../Settings.css';

import { INCLUDED_FEATURES } from './Suscribe.constants';

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

const formatDuration = iso => {
  if (!iso) return '';
  const l = iso.length;
  const n = iso.slice(1, l - 1);
  if (n === '1') {
    return (
      { D: 'Day', W: 'Week', M: 'Month', Y: 'Year' }[iso[l - 1]] || iso[l - 1]
    );
  } else {
    const u =
      { D: 'Days', W: 'Weeks', M: 'Months', Y: 'Years' }[iso[l - 1]] ||
      iso[l - 1];
    return `${n} ${u}`;
  }
};

const formatTitle = title => {
  if (!title) return '';
  return title.replace('(Cboard AAC)', '');
};

const Subscribe = ({
  onClose,
  isLogged,
  subscribe,
  name,
  email,
  location: { country, countryCode },
  onSubmitPeople,
  products
}) => {
  const renderIncludedFeatures = () => {
    return INCLUDED_FEATURES.map(feature => {
      return [
        <ListItem key={feature}>
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage {...messages[feature]} />}
            secondary={null}
          />
        </ListItem>
      ];
    });
  };
  const renderProducts = () => {
    return products.map(product => {
      //const canPurchase = product.canPurchase();
      return product.offers.map(offer => {
        //const canPurchase = window.CdvPurchase.store.canPurchase(offer.id);
        return [
          <Grid
            key={offer.id}
            item
            xs={12}
            sm={6}
            style={{ padding: '5px', maxWidth: 333 }}
          >
            <Card style={{ minWidth: 275 }} variant="outlined">
              <CardContent>
                <Typography
                  sx={{ fontSize: 19 }}
                  color="secondary"
                  gutterBottom
                >
                  {formatTitle(product.title)}
                </Typography>
                <Typography variant="h3" component="div">
                  {offer.pricingPhases[0].price} /
                  {formatDuration(offer.pricingPhases[0].billingPeriod)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth={true}
                  color="primary"
                  onClick={subscribe(product, offer)}
                  //disabled={!canPurchase}
                >
                  <FormattedMessage {...messages.subscribe} />
                </Button>
                <Typography sx={{ mb: 1.5 }} color="secondary">
                  <br />
                  <br />
                  Included Features:
                </Typography>
                <List disablePadding style={{ padding: '5px' }}>
                  {renderIncludedFeatures()}
                </List>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ];
      });
    });
  };
  // const renderProducts = () => {
  //   return products.map(product => {
  //     return [
  //       <Grid
  //         key={product.id}
  //         item
  //         xs={12}
  //         sm={6}
  //         style={{ padding: '5px', maxWidth: 333 }}
  //       >
  //         <Card style={{ minWidth: 275 }} variant="outlined">
  //           <CardContent>
  //             <Typography sx={{ fontSize: 19 }} color="secondary" gutterBottom>
  //               {product.alias}
  //             </Typography>
  //             <Typography variant="h3" component="div">
  //               {product.price} / {product.billingPeriodUnit}
  //             </Typography>
  //             <Button
  //               variant="contained"
  //               fullWidth={true}
  //               color="primary"
  //               onClick={subscribe(product)}
  //               disabled={!product.canPurchase}
  //             >
  //               <FormattedMessage {...messages.subscribe} />
  //             </Button>
  //             <Typography sx={{ mb: 1.5 }} color="secondary">
  //               <br />
  //               <br />
  //               Included Features:
  //             </Typography>
  //             <List disablePadding style={{ padding: '5px' }}>
  //               {renderIncludedFeatures()}
  //             </List>
  //           </CardContent>
  //           <CardActions>
  //             <Button size="small">Learn More</Button>
  //           </CardActions>
  //         </Card>
  //       </Grid>
  //     ];
  //   });
  // };
  return (
    <div className="Subscribe">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.subscribe} />}
        onClose={onClose}
        fullWidth
      >
        <div style={{ flexGrow: 1, padding: 8 }}>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center"
          >
            {renderProducts()}
          </Grid>
        </div>
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
