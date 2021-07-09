import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import './CommunicatorDialog.css';
import messages from './CommunicatorDialog.messages';
import { intlShape, FormattedMessage } from 'react-intl';

import { TAB_INDEXES } from './CommunicatorDialog.constants';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import QueueIcon from '@material-ui/icons/Queue';
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import ClearIcon from '@material-ui/icons/Clear';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

const joyRideStyles = {
  options: {
    arrowColor: '#eee',
    backgroundColor: '#eee',
    primaryColor: '#aa00ff',
    textColor: '#333',
    width: 500,
    zIndex: 10000
  }
};

function CommunicatorDialogTour({
  selectedTab,
  isCommunicatorTourEnabled,
  disableTour,
  intl
}) {
  let CommunicatorDialogBoardsHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughCommunicator} />
        </h2>
      )
    },
    {
      hideCloseButton: true,
      target: '#CommunicatorDialog__BoardBtn',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughBoards} />
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '#CommunicatorDialog__PublicBoardsBtn',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughPublicBoards} />
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '#CommunicatorDialog__AllMyBoardsBtn',
      content: (
        <div>
          <FormattedMessage {...messages.walkthroughAllMyBoards} />
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '.CommunicatorDialogButtons__searchButton',
      content: <FormattedMessage {...messages.walkthroughSearch} />
    },
    {
      hideCloseButton: true,
      target: '[name="ComunnicatorDialog__PropertyOption"]',
      content: (
        <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardProperties} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <PublicIcon />
                  </ListItemIcon>
                  <ListItemText primary="Public board" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <KeyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Private board" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home board" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Remove board" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: 'button:enabled[aria-label="Set as Root Board"]',
      placement: 'top',
      content: (
        <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardProperties} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <ClearIcon />
                  </ListItemIcon>
                  <ListItemText primary="Remove board" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Set as root board" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
      )
    }
  ];

  let CommunicatorDialogPublicBoardsHelpSteps = [
    {
      hideCloseButton: true,
      target: '[aria-label="Copy Board into your communicator"]',
      content: (
        <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardProperties} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <QueueIcon />
                  </ListItemIcon>
                  <ListItemText primary="Public board" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="Private board" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
      )
    }
  ];

  let CommunicatorDialogAllBoardsHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: <h2>HOLA</h2>
    },
    {
      target: '#CommunicatorDialog__boards__item__image__Btn',
      hideCloseButton: true,
      content: <h2>HOLA</h2>
    },
    {
      hideCloseButton: true,
      target: 'button:enabled[aria-label="Publish Board"]',
      content: (
        <div>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardProperties} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <ClearIcon />
                  </ListItemIcon>
                  <ListItemText primary="Public board" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Private board" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <QueueIcon />
                  </ListItemIcon>
                  <ListItemText primary="Private board" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
      )
    }
  ];

  return (
    //(
    <div>
      {selectedTab === TAB_INDEXES.PUBLIC_BOARDS && (
        <Joyride
          callback={data => {
            const { status } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              if (isCommunicatorTourEnabled) {
                console.log('HOLA');
                disableTour({ isCommunicatorTourEnabled: false });
              }
            }
          }}
          steps={CommunicatorDialogPublicBoardsHelpSteps}
          continuous={true}
          showSkipButton={true}
          disableScrollParentFix={true}
          showProgress={false}
          disableOverlayClose={true}
          run={isCommunicatorTourEnabled}
          styles={joyRideStyles}
          locale={{
            last: intl.formatMessage(messages.walkthroughEndTour),
            skip: intl.formatMessage(messages.walkthroughCloseTour)
          }}
        />
      )}
      {selectedTab === TAB_INDEXES.MY_BOARDS && (
        <Joyride
          callback={data => {
            const { status } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              if (isCommunicatorTourEnabled) {
                // disableTour({ isCommunicatorTourEnabled: false });
              }
            }
          }}
          steps={CommunicatorDialogAllBoardsHelpSteps}
          continuous={true}
          showSkipButton={true}
          showProgress={false}
          disableScrollParentFix={true}
          disableOverlayClose={true}
          scrollOffset={200}
          run={isCommunicatorTourEnabled}
          styles={joyRideStyles}
          locale={{
            last: intl.formatMessage(messages.walkthroughEndTour),
            skip: intl.formatMessage(messages.walkthroughCloseTour)
          }}
        />
      )}
      {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS && (
        <Joyride
          callback={data => {
            const { status } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              if (isCommunicatorTourEnabled) {
                // disableTour({ isCommunicatorTourEnabled: false });
              }
            }
          }}
          steps={CommunicatorDialogBoardsHelpSteps}
          continuous={true}
          showSkipButton={true}
          showProgress={false}
          disableOverlayClose={true}
          disableScrolling={true}
          disableScrollParentFix={true}
          run={isCommunicatorTourEnabled}
          styles={joyRideStyles}
          locale={{
            last: intl.formatMessage(messages.walkthroughEndTour),
            skip: intl.formatMessage(messages.walkthroughCloseTour)
          }}
        />
      )}
    </div>
  );
}

export default CommunicatorDialogTour;
