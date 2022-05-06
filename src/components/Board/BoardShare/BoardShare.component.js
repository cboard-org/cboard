import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Alert from '@material-ui/lab/Alert';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage } from 'react-intl';
import CopyIcon from '@material-ui/icons/FilterNone';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '../../UI/IconButton';
import Button from '@material-ui/core/Button';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon
} from 'react-share';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import messages from './BoardShare.messages';

import './BoardShare.css';
import { isAndroid } from '../../../cordova-util';

function shareBoardOnFacebook(url, intl) {
  const shareData = {
    method: 'share',
    href: url,
    hashtag: '#Cboard',
    quote: intl.formatMessage(messages.subject)
  };

  const errorFunction = msg => {
    if (msg.errorCode !== '4201')
      alert(intl.formatMessage(messages.cannotShare));
  };

  window.facebookConnectPlugin.logout(
    function succcesFunction(msg) {},
    function(msg) {
      console.log('error facebook disconnect msg' + msg);
    }
  );

  window.facebookConnectPlugin.login(
    ['email'],
    function succesLogin(userData) {
      window.facebookConnectPlugin.showDialog(
        shareData,
        function succcesFunction() {},
        msg => errorFunction(msg)
      );
    },
    msg => errorFunction(msg)
  );
}

const BoardShare = ({
  label,
  url,
  intl,
  disabled,
  open,
  isOwnBoard,
  isPublic,
  isLogged,
  fullScreen,
  onShareClick,
  onShareClose,
  publishBoard,
  onCopyLink
}) => (
  <React.Fragment>
    <IconButton
      label={label}
      disabled={disabled || open}
      onClick={onShareClick}
    >
      <ShareIcon />
    </IconButton>

    <Dialog
      open={open}
      onClose={onShareClose}
      fullScreen={fullScreen}
      className="ShareDialog__container"
    >
      <DialogTitle className="ShareDialog__title">
        <FormattedMessage {...messages.title} />

        <IconButton
          label={intl.formatMessage(messages.close)}
          onClick={onShareClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="ShareDialog__content">
        <div className="ShareDialog__content__publish">
          {isLogged ? (
            <Button
              color="primary"
              variant={isPublic ? 'outlined' : 'contained'}
              onClick={publishBoard}
            >
              {!isPublic ? (
                <FormattedMessage {...messages.publishBoard} />
              ) : (
                <FormattedMessage {...messages.unpublishBoard} />
              )}
            </Button>
          ) : (
            <React.Fragment>
              <Alert severity="warning">
                <FormattedMessage {...messages.unregisteredWarning} />
              </Alert>
              <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/login-signup"
              >
                <FormattedMessage {...messages.loginSignUp} />
              </Button>
            </React.Fragment>
          )}
        </div>
        {isLogged && (
          <div className="ShareDialog__socialIcons">
            <Button disabled={!isPublic} onClick={onCopyLink} color="primary">
              <div className="ShareDialog__socialIcons__copyAction">
                <div>
                  <CopyIcon />
                </div>
                <FormattedMessage {...messages.copyLink} />
              </div>
            </Button>
            <Button disabled={!isPublic}>
              <EmailShareButton
                subject={intl.formatMessage(messages.subject)}
                body={intl.formatMessage(messages.body, { url: url })}
                url={url}
              >
                <EmailIcon round />
                <FormattedMessage id="email" {...messages.email} />
              </EmailShareButton>
            </Button>

            {!isAndroid() ? (
              <Button disabled={!isPublic}>
                <FacebookShareButton
                  quote={intl.formatMessage(messages.subject)}
                  url={url}
                >
                  <FacebookIcon round />
                  <FormattedMessage id="facebook" {...messages.facebook} />
                </FacebookShareButton>
              </Button>
            ) : (
              <Button
                disabled={!isPublic}
                onClick={() => shareBoardOnFacebook(url, intl)}
              >
                <div>
                  <FacebookIcon round />
                  <FormattedMessage id="facebook" {...messages.facebook} />
                </div>
              </Button>
            )}

            <Button disabled={!isPublic}>
              <TwitterShareButton
                title={intl.formatMessage(messages.subject)}
                hashtags={['cboard', 'AAC']}
                url={url}
              >
                <TwitterIcon round />
                <FormattedMessage id="twitter" {...messages.twitter} />
              </TwitterShareButton>
            </Button>
            <Button disabled={!isPublic}>
              <WhatsappShareButton
                title={intl.formatMessage(messages.subject)}
                url={url}
              >
                <WhatsappIcon round />
                <FormattedMessage id="whatsapp" {...messages.whatsapp} />
              </WhatsappShareButton>
            </Button>
            <Button disabled={!isPublic}>
              <RedditShareButton
                title={intl.formatMessage(messages.subject)}
                url={url}
              >
                <RedditIcon round />
                <FormattedMessage id="reddit" {...messages.reddit} />
              </RedditShareButton>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </React.Fragment>
);

BoardShare.defaultProps = {
  open: false,
  disabled: false,
  onShareClose: () => {},
  onCopyLink: () => {}
};

BoardShare.propTypes = {
  open: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  onShareClose: PropTypes.func,
  onShareClick: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired
};

export default withMobileDialog()(BoardShare);
