import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

import messages from './About.messages';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import CboardLogo from '../../WelcomeScreen/CboardLogo';
import unicefLogo from './unicef.png';
import microsoftLogo from './microsoft.png';
import './About.css';

const itemData = [
  {
    img: unicefLogo,
    title: 'UNICEF',
    author: 'UNICEF'
  },
  {
    img: microsoftLogo,
    title: 'Microsoft',
    author: 'Microsoft'
  }
];

About.propTypes = {
  history: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

function About({ history, onClose }) {
  return (
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.about} />}
      onClose={history.goBack}
    >
      <Paper>
        <FullScreenDialogContent>
          <div className="logo">
            <CboardLogo isViolet={true} />
          </div>
          <Typography variant="h6" gutterBottom={true}>
            <FormattedMessage {...messages.copyright} />
          </Typography>
          <Typography variant="body1">
            <FormattedMessage {...messages.intro} />
          </Typography>
          <div className="title">
            <Typography variant="h5">
              <FormattedMessage {...messages.contribute} />
            </Typography>
          </div>
          <Typography variant="body1" gutterBottom={true} component="div">
            <React.Fragment>
              <FormattedMessage {...messages.contributeText} />
              <Link
                href="https://github.com/cboard-org/cboard/"
                target="_blank"
              >
                {' Cboard Github'}
              </Link>
            </React.Fragment>
          </Typography>
          <Typography variant="h5">
            <FormattedMessage {...messages.license} />
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>
                Code -{' '}
                <Link
                  href="https://github.com/shayc/cboard/blob/master/LICENSE"
                  target="_blank"
                >
                  GPLv3
                </Link>
              </li>
              <li>
                Mulberry Symbols -{' '}
                <Link
                  href="https://creativecommons.org/licenses/by-sa/2.0/uk/"
                  target="_blank"
                >
                  CC BY-SA
                </Link>
              </li>
              <li>
                ARASAAC Symbols -{' '}
                <Link href="https://arasaac.org/terms-of-use/" target="_blank">
                  Creative Commons License BY-NC-SA
                </Link>
              </li>
            </ul>
          </Typography>
          <Typography variant="h5">
            <FormattedMessage {...messages.thanks} />
          </Typography>
          <Typography variant="body1" component="div">
            <FormattedMessage {...messages.thanksBody} />
          </Typography>
          <div className="imageContainer">
            {itemData.map(item => (
              <img src={item.img} alt={item.title} className="imageItem" />
            ))}
          </div>
        </FullScreenDialogContent>
      </Paper>
    </FullScreenDialog>
  );
}

export default About;
