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

  state = {
    selectedLang: this.props.lang,
    openArasaacDialog: { open: false, downloadingArasaacData: false }
  };

  updateSymbolsSettings = async symbolsSettings => {
    this.props.updateSymbolsSettings(symbolsSettings);
  };

  handleCloseArasaacDialog = () => {
    this.setState({ openDialog: { open: false } });
  };

  handleDialogArasaacAcepted = downloadingLangData => {
    this.setState({
      openArasaacDialog: { open: false, downloadingArasaacData: true }
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
        />
        <DownloadArasaacDialog
          onClose={this.handleCloseArasaacDialog}
          onDialogAcepted={this.handleDialogArasaacAcepted}
          open={this.state.openArasaacDialog.open}
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
