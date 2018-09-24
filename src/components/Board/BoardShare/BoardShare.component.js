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
  GooglePlusShareButton,
  GooglePlusIcon,
  EmailShareButton,
  EmailIcon
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
          {isOwnBoard &&
            !isPublic && (
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
          <div>
            <Button disabled={!isPublic} onClick={copyLinkAction}>
              <div className="ShareDialog__socialIcons__copyAction">
                <div>
                  <CopyIcon />
                </div>
                <FormattedMessage {...messages.copyLink} />
              </div>
            </Button>
            <Button disabled={!isPublic}>
              <EmailShareButton url={url}>
                <EmailIcon round />
                <FormattedMessage {...messages.email} />
              </EmailShareButton>
            </Button>
            <Button disabled={!isPublic}>
              <FacebookShareButton url={url}>
                <FacebookIcon round />
                <FormattedMessage {...messages.facebook} />
              </FacebookShareButton>
            </Button>
          </div>
          <div>
            <Button disabled={!isPublic}>
              <TwitterShareButton url={url}>
                <TwitterIcon round />
                <FormattedMessage {...messages.twitter} />
              </TwitterShareButton>
            </Button>
            <Button disabled={!isPublic}>
              <GooglePlusShareButton url={url}>
                <GooglePlusIcon round />
                <FormattedMessage {...messages.googlePlus} />
              </GooglePlusShareButton>
            </Button>
          </div>
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
