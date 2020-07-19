import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';

import messages from './Help.messages';
import FullScreenDialog, {
} from '../../UI/FullScreenDialog';

import './Help.css';

Help.propTypes = {
  history: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

function Help({ history, onClose }) {
  const [markdown, setMarkdown] = useState(false);
  const readmePath = require('../../../translations/help/en-US.md');
  fetch(readmePath)
    .then(response => {
      return response.text();
    })
    .then(text => {
      setMarkdown(text);
    });
  return (
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.help} />}
      onClose={history.goBack}
    >
      <ReactMarkdown source={markdown} escapeHtml={false}/>
    </FullScreenDialog>
  );
}

export default Help;
