import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';

import FullScreenDialog from '../../UI/FullScreenDialog';
import { isCordova } from '../../../cordova-util';
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
    let readmePath = '';
    try {
      readmePath = require(`../../../translations/help/${
        this.props.language.lang
      }.md`);
    } catch (err) {
      readmePath = require(`../../../translations/help/en-US.md`);
    } finally {
      if (isCordova()) {
        const req = new XMLHttpRequest();
        req.onload = () => {
          const text = req.responseText;
          const sr = /\* \[.+\n/g;
          const utext = text.replace(sr, ' ');
          const searchRegExp = /\/images/gi;
          const replaceWith = './images';
          this.setState({ markdown: utext.replace(searchRegExp, replaceWith) });
        };
        req.open('GET', readmePath);
        req.send();
      } else {
        fetch(readmePath)
          .then(response => {
            return response.text();
          })
          .then(text => {
            this.setState({ markdown: text });
          });
      }
    }
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
        <Paper className="Help">
          <ReactMarkdown source={this.state.markdown} escapeHtml={false} />
        </Paper>
      </FullScreenDialog>
    );
  }
}

const mapStateToProps = state => ({
  language: state.language
});

const mapDispatchToProps = {};

Help.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help);
