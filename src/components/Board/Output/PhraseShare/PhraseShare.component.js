import React from 'react';
import PropTypes from 'prop-types';
//import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage } from 'react-intl';
import CopyIcon from '@material-ui/icons/FilterNone';
import CloseIcon from '@material-ui/icons/Close';
import ShareButton from '../SymbolOutput/ShareButton';
import IconButton from '../../../UI/IconButton';
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
import messages from './PhraseShare.messages';

import './PhraseShare.css';

const PhraseShare = ({
  label,
  phrase,
  intl,
  open,
  fullScreen,
  onShareClick,
  onShareClose,
  onCopyPhrase,
  style,
  hidden
}) => (
  <React.Fragment>
    <ShareButton
      label={label}
      color="inherit"
      onClick={onShareClick}
      style={style}
      hidden={hidden}
    />
    <Dialog
      open={open}
      onClose={onShareClose}
      fullScreen={fullScreen}
      className="SharePhraseDialog__container"
    >
      <DialogTitle className="SharePhraseDialog__title">
        <FormattedMessage {...messages.title} />

        <IconButton
          label={intl.formatMessage(messages.close)}
          onClick={onShareClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="SharePhraseDialog__content">
        <div className="SharePhraseDialog__socialIcons">
          <Button onClick={onCopyPhrase} color="primary">
            <div className="SharePhraseDialog__socialIcons__copyAction">
              <div>
                <CopyIcon />
              </div>
              <FormattedMessage {...messages.copyLink} />
            </div>
          </Button>
          <Button>
            <EmailShareButton
              subject={intl.formatMessage(messages.subject)}
              body={phrase}
            >
              <EmailIcon round />
              <FormattedMessage id="email" {...messages.email} />
            </EmailShareButton>
          </Button>
          <Button>
            <FacebookShareButton
              url={'https://app.cboard.io'}
              quote={phrase}
              onShareWindowClose={onShareClose}
            >
              <FacebookIcon round />
              <FormattedMessage id="facebook" {...messages.facebook} />
            </FacebookShareButton>
          </Button>
          <Button>
            <TwitterShareButton
              hashtags={['cboard', 'AAC']}
              via={'cboard_io'}
              url={phrase}
              onShareWindowClose={onShareClose}
            >
              <TwitterIcon round />
              <FormattedMessage id="twitter" {...messages.twitter} />
            </TwitterShareButton>
          </Button>
          <Button>
            <WhatsappShareButton url={phrase} onShareWindowClose={onShareClose}>
              <WhatsappIcon round />
              <FormattedMessage id="whatsapp" {...messages.whatsapp} />
            </WhatsappShareButton>
          </Button>
          <Button>
            <RedditShareButton
              title={phrase}
              url={'https://app.cboard.io'}
              onShareWindowClose={onShareClose}
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

PhraseShare.defaultProps = {
  open: false,
  disabled: false,
  onShareClose: () => {},
  onCopyPhrase: () => {}
};

PhraseShare.propTypes = {
  open: PropTypes.bool,
  phrase: PropTypes.string.isRequired,
  onShareClose: PropTypes.func,
  onShareClick: PropTypes.func.isRequired,
  onCopyPhrase: PropTypes.func
};

export default withMobileDialog()(PhraseShare);
