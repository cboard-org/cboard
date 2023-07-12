import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { readFile } from '../../../idb/arasaac/jszip';
import { getArasaacDB, clearArasaacDB } from '../../../idb/arasaac/arasaacdb';

import Symbols from './Symbols.component';
import DownloadArasaacDialog from './DownloadArasaacDialog';
import NoConnectionDialog from './NoConnectionDialog';
import DeleteArasaacDialog from './DeleteArasaacDialog';
import { updateSymbolsSettings } from '../../App/App.actions';

export class SymbolsContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      openArasaacDialog: false,
      arasaacProcess: '',
      openNoConnectionDialog: false,
      openDeleteArasaacDialog: false,
      isDeleting: false
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
    if (symbolsSettings.openDeleteArasaacDialog) {
      this.setState({
        ...this.state,
        openDeleteArasaacDialog: true
      });
    }
  };

  handleCloseDialogs = () => {
    this.setState({
      ...this.state,
      openArasaacDialog: false,
      openNoConnectionDialog: false,
      openDeleteArasaacDialog: false
    });
  };

  handleNoConnection = status => {
    this.setState({
      ...this.state,
      openNoConnectionDialog: status ? true : false
    });
  };

  handleDialogArasaacAcepted = () => {
    const arasaacFiles = [
      {
        name: 'ARASAAC',
        thumb: 'https://app.cboard.io/symbols/arasaac/arasaac.svg',
        file:
          'https://cboardgroupqadiag.blob.core.windows.net/arasaac/arasaac.zip',
        filename: 'arasaac.zip'
      }
    ];
    this.arasaacDownload.files = arasaacFiles;
    this.arasaacDownload.started = true;

    this.setState({
      ...this.state,
      openArasaacDialog: false
    });
  };

  handleDeleteDialogAcepted = async () => {
    this.setState({
      isDeleting: true
    });

    await clearArasaacDB();

    this.props.updateSymbolsSettings({
      ...this.props.symbolsSettings,
      arasaacActive: false
    });

    this.setState({
      openDeleteArasaacDialog: false,
      isDeleting: false
    });
  };

  handleCompleted = async file => {
    this.props.updateSymbolsSettings({
      ...this.props.symbolsSettings,
      arasaacActive: true
    });
    this.setState({
      ...this.state,
      arasaacProcess: 'doing'
    });
    try {
      const content = await readFile(file);
      const arasaacDB = await getArasaacDB();
      arasaacDB.importContent(content);
      arasaacDB.initTextStore(this.props.lang.slice(0, 2));
      this.setState({
        ...this.state,
        arasaacProcess: 'done'
      });
    } catch (err) {
      console.error(err.message);
      this.setState({
        ...this.state,
        arasaacProcess: 'error'
      });
    }
  };

  handleDownloadError = () => {
    this.setState({
      ...this.state,
      arasaacProcess: 'error'
    });
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
          arasaacProcess={this.state.arasaacProcess}
          noConnection={this.handleNoConnection}
          onDownloadError={this.handleDownloadError}
          intl={this.props.intl}
        />
        <DownloadArasaacDialog
          onClose={this.handleCloseDialogs}
          onDialogAcepted={this.handleDialogArasaacAcepted}
          open={this.state.openArasaacDialog}
        />
        <DeleteArasaacDialog
          onClose={this.handleCloseDialogs}
          onDialogAcepted={this.handleDeleteDialogAcepted}
          open={this.state.openDeleteArasaacDialog}
          isDeleting={this.state.isDeleting}
        />
        <NoConnectionDialog
          onClose={this.handleCloseDialogs}
          open={this.state.openNoConnectionDialog}
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

const mapStateToProps = ({ app, language: { lang } }) => ({
  symbolsSettings: app.symbolsSettings,
  lang
});

const mapDispatchToProps = {
  updateSymbolsSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SymbolsContainer));
