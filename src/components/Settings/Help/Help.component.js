import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';

import FullScreenDialog, {
} from '../../UI/FullScreenDialog';
import messages from '../Settings.messages';
import './Help.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

class Help extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      markdown: ''
    };
  }

  componentDidMount() {
    const readmePath = require('../../../translations/help/en-US.md');
    fetch(readmePath)
      .then(response => {
        return response.text();
      })
      .then(text => {
        this.setState({ markdown: text });
      });
  }

  componentDidUpdate() {
    let hash = window.location.hash.replace('#', '');
    if (hash) {
      let node = window.document.getElementsByName(hash)[0];
      if (node) {
        node.scrollIntoView();
      }
    }
  }

  render() {
    return (
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.userHelp} />}
        onClose={this.props.history.goBack}
      >
        <ReactMarkdown source={this.state.markdown} escapeHtml={false} />
      </FullScreenDialog>
    );
  }
}

Help.propTypes = propTypes;
export default Help;
