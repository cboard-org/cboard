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
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onCompleted: PropTypes.func,
  updateSymbolsSettings: PropTypes.func,
  arasaacDownload: PropTypes.object,
  arasaacProcess: PropTypes.string
};

class Symbols extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //arasaacEnabled: props.symbolsSettings.arasaacActive
      arasaacEnabled: false
    };
  }

  toggleArasaacSymbols = () => {
    this.setState({
      arasaacEnabled: !this.state.arasaacEnabled
    });
    this.props.updateSymbolsSettings({
      arasaacEnabled: !this.state.arasaacEnabled
    });
  };

  render() {
    const {
      onClose,
      arasaacDownload,
      onCompleted,
      onSubmit,
      arasaacProcess
    } = this.props;

    return (
      <div className="Symbols">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.symbols} />}
          onClose={onClose}
          onSubmit={onSubmit}
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
                      false
                      //symbolsSettings.arasaacActive || arasaacDownload.started
                      //? true
                      //: false
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
