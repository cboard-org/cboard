import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage } from 'react-intl';
import CopyIcon from '@material-ui/icons/FilterNone';
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
import messages from './CommunicatorShare.messages';

import './CommunicatorShare.css';

const CommunicatorShare = ({
  label,
  url,
  disabled,
  open,
  onShareClick,
  onShareClose,
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
      className="ShareDialog__container"
    >
      <DialogTitle className="ShareDialog__title">
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent className="ShareDialog__content">
        <FormattedMessage {...messages.shareALink} />

        <div className="ShareDialog__socialIcons">
          <div>
            <Button onClick={copyLinkAction}>
              <div className="ShareDialog__socialIcons__copyAction">
                <div>
                  <CopyIcon />
                </div>
                <FormattedMessage {...messages.copyLink} />
              </div>
            </Button>
            <Button>
              <EmailShareButton url={url}>
                <EmailIcon round />
                <FormattedMessage {...messages.email} />
              </EmailShareButton>
            </Button>
            <Button>
              <FacebookShareButton url={url}>
                <FacebookIcon round />
                <FormattedMessage {...messages.facebook} />
              </FacebookShareButton>
            </Button>
          </div>
          <div>
            <Button>
              <TwitterShareButton url={url}>
                <TwitterIcon round />
                <FormattedMessage {...messages.twitter} />
              </TwitterShareButton>
            </Button>
            <Button>
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

CommunicatorShare.defaultProps = {
  open: false,
  disabled: false,
  onShareClose: () => {},
  copyLinkAction: () => {}
};

CommunicatorShare.propTypes = {
  open: PropTypes.bool,
  url: PropTypes.string.isRequired,
  onShareClose: PropTypes.func,
  onShareClick: PropTypes.func.isRequired,
  copyLinkAction: PropTypes.func
};

export default CommunicatorShare;
