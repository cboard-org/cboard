import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import './CommunicatorDialog.css';
import messages from './CommunicatorDialog.messages';
import { FormattedMessage } from 'react-intl';

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
import DeleteIcon from '@material-ui/icons/Delete';
import InputIcon from '@material-ui/icons/Input';

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
  handleCommunicatorTour,
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
      target: '[name="CommunicatorDialog__PropertyOption"]',
      content: (
        <div class="CommunicatorDialog__Tour CommunicatorDialog__Tour__boardProperty">
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={12}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardProperties} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <PublicIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(messages.publicBoard)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <KeyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(messages.privateBoard)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(messages.rootBoard)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RemoveRedEyeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(messages.activeBoard)}
                  />
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
        <div class="CommunicatorDialog__Tour">
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={12}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardActionButton} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <ClearIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughBoardActionsRemove
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughBoardActionsSetBoardAsRoot
                    )}
                  />
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
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughPublicBoards} />
        </h2>
      )
    },
    {
      hideCloseButton: true,
      target: '[aria-label="Board Information"]',
      content: (
        <div class="CommunicatorDialog__Tour">
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={12}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardActionButton} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <QueueIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughPublicBoardCopy
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughPublicBoardDetail
                    )}
                  />
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
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughAllMyBoards} />
        </h2>
      )
    },
    {
      target: '#CommunicatorDialog__boards__item__image__Btn',
      hideCloseButton: true,
      content: <FormattedMessage {...messages.imageBoard} />
    },
    {
      target: 'button:enabled[aria-label="Edit board name and description"]',
      hideCloseButton: true,
      content: <FormattedMessage {...messages.editBoardTitle} />
    },
    {
      hideCloseButton: true,
      target:
        'button:enabled[aria-label="Publish Board"],button:enabled[aria-label="Unpublish Board"]',
      placement: 'left',
      content: (
        <div class="CommunicatorDialog__Tour">
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} md={12}>
              <Typography variant="h6">
                <FormattedMessage {...messages.walkthroughBoardActionButton} />
              </Typography>
              <List>
                <ListItem alignItems="center">
                  <ListItemIcon>
                    <ClearIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughAllMyBoardsRemoveBoard
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InputIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughAllMyBoardsAddBoard
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <KeyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughAllMyBoardsUnpublishBoard
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughAllMyBoardsPublishBoard
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughAllMyBoardsDeleteBoard
                    )}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
      )
    }
  ];
  return (
    <div>
      {selectedTab === TAB_INDEXES.PUBLIC_BOARDS && (
        <Joyride
          callback={data => {
            const { status } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              if (handleCommunicatorTour) {
                disableTour({
                  disableCommunicatorTour: { isPublicBoardsEnabled: false }
                });
              }
            }
          }}
          steps={CommunicatorDialogPublicBoardsHelpSteps}
          continuous={true}
          showSkipButton={true}
          disableScrollParentFix={true}
          disableScrolling={true}
          showProgress={false}
          disableOverlayClose={true}
          run={handleCommunicatorTour}
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
              if (handleCommunicatorTour) {
                disableTour({
                  disableCommunicatorTour: { isAllMyBoardsEnabled: false }
                });
              }
            }
          }}
          steps={CommunicatorDialogAllBoardsHelpSteps}
          continuous={true}
          showSkipButton={true}
          showProgress={false}
          disableScrollParentFix={true}
          disableOverlayClose={true}
          scrollOffset={250}
          run={handleCommunicatorTour}
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
              console.log(handleCommunicatorTour);
              if (handleCommunicatorTour) {
                disableTour({
                  disableCommunicatorTour: { isBoardsEnabled: false }
                });
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
          run={handleCommunicatorTour}
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
