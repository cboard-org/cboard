import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import Joyride, { STATUS } from 'react-joyride';

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

import './CommunicatorDialog.css';
import messages from './CommunicatorDialog.messages';

const propTypes = {
  communicatorTour: PropTypes.object.isRequired,
  selectedTab: PropTypes.number,
  disableTour: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

const joyrideStyles = {
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
  communicatorTour,
  selectedTab,
  disableTour,
  intl
}) {
  const commBoardsHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <div>
          <h2>
            <FormattedMessage {...messages.walkthroughCommunicatorTitle} />
          </h2>
          <h5>
            <FormattedMessage {...messages.walkthroughCommunicator} />
          </h5>
        </div>
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
        <div className="CommunicatorDialog__Tour CommunicatorDialog__Tour__boardProperty">
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
      target: '.CommunicatorDialog__boards__item__actions',
      placement: 'left',
      content: (
        <div className="CommunicatorDialog__Tour">
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

  const publicBoardsHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <div>
          <h2>
            <FormattedMessage {...messages.allBoards} />
          </h2>
          <h5>
            <FormattedMessage {...messages.walkthroughPublicBoards} />
          </h5>
        </div>
      )
    },
    {
      hideCloseButton: true,
      target: '.CommunicatorDialog__boards__item__actions',
      placement: 'left',
      content: (
        <div className="CommunicatorDialog__Tour">
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
                      messages.walkthroughPublicBoardsCopy
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage(
                      messages.walkthroughPublicBoardsDetail
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

  const allMyBoardsHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <div>
          <h2>
            <FormattedMessage {...messages.myBoards} />
          </h2>
          <h5>
            <FormattedMessage {...messages.walkthroughAllMyBoards} />
          </h5>
        </div>
      )
    },
    {
      target: '#CommunicatorDialog__boards__item__image__Btn',
      hideCloseButton: true,
      content: (
        <FormattedMessage {...messages.walkthroughAllMyBoardsEditBoardImage} />
      )
    },
    {
      target: '.CommunicatorDialog__boards__item__edit-title',
      hideCloseButton: true,
      content: (
        <FormattedMessage {...messages.walkthroughAllMyBoardsEditBoardName} />
      )
    },
    {
      hideCloseButton: true,
      target: '.CommunicatorDialog__boards__item__actions',
      placement: 'left',
      content: (
        <div className="CommunicatorDialog__Tour">
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
      {selectedTab === TAB_INDEXES.PUBLIC_BOARDS &&
        communicatorTour.isPublicBoardsEnabled && (
          <Joyride
            callback={data => {
              const { status } = data;
              if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                disableTour({
                  communicatorTour: {
                    ...communicatorTour,
                    isPublicBoardsEnabled: false
                  }
                });
              }
            }}
            steps={publicBoardsHelpSteps}
            continuous={true}
            showSkipButton={true}
            disableScrollParentFix={true}
            disableScrolling={true}
            showProgress={false}
            disableOverlayClose={true}
            run={communicatorTour.isPublicBoardsEnabled}
            styles={joyrideStyles}
            locale={{
              last: intl.formatMessage(messages.walkthroughEndTour),
              skip: intl.formatMessage(messages.walkthroughCloseTour),
              next: intl.formatMessage(messages.walkthroughNext),
              back: intl.formatMessage(messages.walkthroughBack)
            }}
          />
        )}
      {selectedTab === TAB_INDEXES.MY_BOARDS &&
        communicatorTour.isAllMyBoardsEnabled && (
          <Joyride
            callback={data => {
              const { status } = data;
              if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                disableTour({
                  communicatorTour: {
                    ...communicatorTour,
                    isAllMyBoardsEnabled: false
                  }
                });
              }
            }}
            steps={allMyBoardsHelpSteps}
            continuous={true}
            showSkipButton={true}
            showProgress={false}
            disableScrollParentFix={true}
            disableOverlayClose={true}
            scrollOffset={250}
            run={communicatorTour.isAllMyBoardsEnabled}
            styles={joyrideStyles}
            locale={{
              last: intl.formatMessage(messages.walkthroughEndTour),
              skip: intl.formatMessage(messages.walkthroughCloseTour),
              next: intl.formatMessage(messages.walkthroughNext),
              back: intl.formatMessage(messages.walkthroughBack)
            }}
          />
        )}
      {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS &&
        communicatorTour.isCommBoardsEnabled && (
          <Joyride
            callback={data => {
              const { status } = data;
              if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                disableTour({
                  communicatorTour: {
                    ...communicatorTour,
                    isCommBoardsEnabled: false
                  }
                });
              }
            }}
            steps={commBoardsHelpSteps}
            continuous={true}
            showSkipButton={true}
            showProgress={false}
            disableOverlayClose={true}
            disableScrolling={true}
            disableScrollParentFix={true}
            run={communicatorTour.isCommBoardsEnabled}
            styles={joyrideStyles}
            locale={{
              last: intl.formatMessage(messages.walkthroughEndTour),
              skip: intl.formatMessage(messages.walkthroughCloseTour),
              next: intl.formatMessage(messages.walkthroughNext),
              back: intl.formatMessage(messages.walkthroughBack)
            }}
          />
        )}
    </div>
  );
}

CommunicatorDialogTour.propTypes = propTypes;

export default CommunicatorDialogTour;
