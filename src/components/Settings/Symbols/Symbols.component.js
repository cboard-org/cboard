import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '../../UI/IconButton/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import FullScreenDialog from '../../UI/FullScreenDialog';
import Downloader from './../../UI/Downloader';
import messages from './Symbols.messages';
import './Symbols.css';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  handleOpenDialogs: PropTypes.func.isRequired,
  arasaacDownload: PropTypes.object,
  arasaacProcess: PropTypes.string,
  symbolsSettings: PropTypes.object.isRequired,
  noConnection: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

class Symbols extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      noConnectionEnabled: false
    };
  }

  downloadArasaacSymbols = () => {
    if (window.navigator.onLine) {
      this.setState({
        noConnectionEnabled: false
      });
      this.props.handleOpenDialogs({
        openDownloadArasaacDialog: true
      });
    } else {
      this.setState({
        noConnectionEnabled: true
      });
      this.props.noConnection(true);
    }
  };

  deleteArasaacSymbols = () => {
    this.props.handleOpenDialogs({
      openDeleteArasaacDialog: true
    });
  };

  handleError = () => {
    this.props.onDownloadError();
  };

  render() {
    const {
      onClose,
      arasaacDownload,
      onCompleted,
      arasaacProcess,
      symbolsSettings,
      intl
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
              <ListItem style={{ paddingRight: 0 }}>
                <ListItemText
                  className="Symbols__ListItemText"
                  primary={<FormattedMessage {...messages.downloadArasaac} />}
                  secondary={
                    <FormattedMessage {...messages.downloadArasaacSecondary} />
                  }
                />
                <ListItemSecondaryAction
                  style={{
                    visibility: arasaacDownload.started ? 'hidden' : 'visible'
                  }}
                >
                  {symbolsSettings.arasaacActive ? (
                    <IconButton
                      label={intl.formatMessage(messages.delete)}
                      onClick={this.deleteArasaacSymbols}
                    >
                      <DeleteForeverIcon fontSize="large" />
                    </IconButton>
                  ) : (
                    <IconButton
                      label={intl.formatMessage(messages.download)}
                      onClick={this.downloadArasaacSymbols}
                    >
                      <GetAppIcon fontSize="large" />
                    </IconButton>
                  )}
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
