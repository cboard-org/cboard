import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FullScreenDialog from '../../UI/FullScreenDialog';
import Downloader from './../../UI/Downloader';
import messages from './Symbols.messages';
import './Symbols.css';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  updateSymbolsSettings: PropTypes.func.isRequired,
  arasaacDownload: PropTypes.object,
  arasaacProcess: PropTypes.string,
  symbolsSettings: PropTypes.object.isRequired,
  noConnection: PropTypes.func.isRequired,
};

class Symbols extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      arasaacEnabled: props.symbolsSettings.arasaacActive,
      noConnectionEnabled: false,
    };
  }

  toggleArasaacSymbols = () => {
    if (window.navigator.onLine) {
      this.setState({
        arasaacEnabled: !this.state.arasaacEnabled,
        noConnectionEnabled: false,
      });
      this.props.updateSymbolsSettings({
        arasaacEnabled: !this.state.arasaacEnabled,
      });
    } else {
      this.setState({
        noConnectionEnabled: true,
      });
      this.props.noConnection(true);
    }
  };

  handleError = () => {
    this.setState({
      arasaacEnabled: !this.state.arasaacEnabled,
    });
  };

  render() {
    const {
      onClose,
      arasaacDownload,
      onCompleted,
      arasaacProcess,
      symbolsSettings,
    } = this.props;

    return (
      <div className="Symbols">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.symbols} />}
          onClose={onClose}
        >
          <Paper>
            <List>
              <ListItem>
                <ListItemText
                  className="Symbols__ListItemText"
                  primary={<FormattedMessage {...messages.downloadArasaac} />}
                  secondary={
                    <FormattedMessage {...messages.downloadArasaacSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.arasaacEnabled}
                    onChange={this.toggleArasaacSymbols}
                    value="active"
                    color="secondary"
                    disabled={
                      symbolsSettings.arasaacActive || arasaacDownload.started
                        ? true
                        : false
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            {arasaacDownload.started && (
              <Downloader
                files={arasaacDownload.files}
                completed={onCompleted}
                processing={arasaacProcess}
                onError={this.handleError}
              />
            )}
            <div className="Symbols__HelpText">
              <div>
                <FormattedMessage {...messages.symbolsArasaacHelp} />
              </div>
            </div>
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

Symbols.propTypes = propTypes;

export default Symbols;
