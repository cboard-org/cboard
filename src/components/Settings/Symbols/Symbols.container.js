import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import Symbols from './Symbols.component';
import DownloadArasaacDialog from './DownloadArasaacDialog';
import { updateSymbolsSettings } from '../../App/App.actions';

export class SymbolsContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      openArasaacDialog: false,
      downloadingArasaacData: false
    };

    this.arasaacDownload = {};
  }

  updateSymbolsSettings = symbolsSettings => {
    if (symbolsSettings.arasaacEnabled) {
      this.setState({
        ...this.state,
        openArasaacDialog: true
      });
    }
  };

  handleCloseArasaacDialog = () => {
    this.setState({
      ...this.state,
      openArasaacDialog: false
    });
  };

  handleDialogArasaacAcepted = () => {
    const arasaacFiles = [
      {
        name: 'ARASAAC',
        thumb: 'https://app.cboard.io/symbols/arasaac/arasaac.svg',
        file:
          'https://cboardgroupqadiag.blob.core.windows.net/apk/app-litecro_v1.3.10.apk',
        //file: "https://cboardgroupqadiag.blob.core.windows.net/arasaac/arasaac.zip",
        filename: 'arasaac.zip'
      }
    ];
    this.arasaacDownload.files = arasaacFiles;
    this.arasaacDownload.started = true;

    this.setState({
      ...this.state,
      openArasaacDialog: false,
      downloadingArasaacData: true
    });
  };

  handleCompleted = () => {
    this.props.updateSymbolsSettings({
      ...this.props.symbolsSettings,
      arasaacActive: true
    });
  };

  handleSubmit = () => {
    this.props.updateSymbolsSettings({ ...this.props.symbolsSettings });
  };

  render() {
    const { history, symbolsSettings } = this.props;

    return (
      <>
        <Symbols
          onClose={history.goBack}
          updateSymbolsSettings={this.updateSymbolsSettings}
          symbolsSettings={symbolsSettings}
          arasaacDownload={this.arasaacDownload}
          onCompleted={this.handleCompleted}
        />
        <DownloadArasaacDialog
          onClose={this.handleCloseArasaacDialog}
          onDialogAcepted={this.handleDialogArasaacAcepted}
          open={this.state.openArasaacDialog}
        />
      </>
    );
  }
}

SymbolsContainer.props = {
  history: PropTypes.object,
  updateSymbolsSettings: PropTypes.func.isRequired,
  symbolsSettings: PropTypes.object.isRequired
};

const mapStateToProps = ({ app }) => ({
  symbolsSettings: app.symbolsSettings
});

const mapDispatchToProps = {
  updateSymbolsSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SymbolsContainer));
