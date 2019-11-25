import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
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

const BoardShare = ({
  label,
  url,
  intl,
  disabled,
  open,
  isOwnBoard,
  isPublic,
  fullScreen,
  onShareClick,
  onShareClose,
  publishBoard,
  copyLinkAction
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
        <div className="ShareDialog__Subtitle">
          <FormattedMessage {...messages.shareALink} />
          {isOwnBoard && !isPublic && (
            <Button
              color="primary"
              className="ShareDialog__ToggleStatusButton"
              onClick={publishBoard}
            >
              <FormattedMessage {...messages.publishBoard} />
            </Button>
          )}
        </div>

        <div className="ShareDialog__socialIcons">
          <Button disabled={!isPublic} onClick={copyLinkAction}>
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
          <Button disabled={!isPublic}>
            <FacebookShareButton
              quote={intl.formatMessage(messages.subject)}
              url={url}
            >
              <FacebookIcon round />
              <FormattedMessage id="facebook" {...messages.facebook} />
            </FacebookShareButton>
          </Button>
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
      </DialogContent>
    </Dialog>
  </React.Fragment>
);

BoardShare.defaultProps = {
  open: false,
  disabled: false,
  onShareClose: () => {},
  copyLinkAction: () => {}
};

BoardShare.propTypes = {
  open: PropTypes.bool,
  url: PropTypes.string.isRequired,
  onShareClose: PropTypes.func,
  onShareClick: PropTypes.func.isRequired,
  copyLinkAction: PropTypes.func
};

export default withMobileDialog()(BoardShare);
