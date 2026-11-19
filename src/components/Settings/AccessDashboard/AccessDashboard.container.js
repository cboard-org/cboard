import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';

import API from '../../../api';
import AccessDashboard from './AccessDashboard.component';
import { getAccessPath } from './accessGates';
import { printQrCode, downloadQrCode } from './qrCodeActions';
import { showNotification } from '../../Notifications/Notifications.actions';
import { getUser, isLogged } from '../../App/App.selectors';
import { isAndroid } from '../../../cordova-util';
import messages from './AccessDashboard.messages';

export class AccessDashboardContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isAccessClient: PropTypes.bool.isRequired,
    showNotification: PropTypes.func.isRequired
  };

  state = {
    clients: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    if (this.canView()) {
      this.fetchClients();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  canView = () => this.props.isLogged && this.props.isAccessClient;

  fetchClients = async () => {
    this.setState({ loading: true, error: null });
    try {
      const { data } = await API.getMyAccessClients();
      if (!this.unmounted) {
        this.setState({ clients: data, loading: false });
      }
    } catch (error) {
      if (!this.unmounted) {
        this.setState({ error, loading: false });
      }
    }
  };

  handleOpenBoard = (client, gate) => {
    this.props.history.push(getAccessPath(client, gate));
  };

  handleCopyLink = async (url) => {
    const { intl, showNotification } = this.props;
    try {
      if (isAndroid()) {
        await window.cordova.plugins.clipboard.copy(url);
      } else {
        await navigator.clipboard.writeText(url);
      }
      showNotification(intl.formatMessage(messages.linkCopied));
    } catch (e) {
      showNotification(intl.formatMessage(messages.copyLinkFailed), 'error');
    }
  };

  handlePrintQr = async (client, gate) => {
    const { intl, showNotification } = this.props;
    try {
      await printQrCode(gate.qrCodeUrl, client.clientName);
    } catch (e) {
      showNotification(intl.formatMessage(messages.qrPrintFailed), 'error');
    }
  };

  handleDownloadQr = async (client, gate) => {
    const { intl, showNotification } = this.props;
    try {
      const savedOnDevice = await downloadQrCode(
        gate.qrCodeUrl,
        `${client.slug}-${gate.code}.png`
      );
      if (savedOnDevice) {
        showNotification(intl.formatMessage(messages.qrSaved));
      }
    } catch (e) {
      showNotification(intl.formatMessage(messages.qrSaveFailed), 'error');
    }
  };

  render() {
    const { intl, history, isLogged } = this.props;
    const { clients, loading, error } = this.state;

    if (!isLogged) {
      return <Redirect to="/login-signup" />;
    }
    if (!this.canView()) {
      return <Redirect to="/settings" />;
    }

    return (
      <AccessDashboard
        intl={intl}
        clients={clients}
        loading={loading}
        error={error}
        onRetry={this.fetchClients}
        onClose={history.goBack}
        onOpenBoard={this.handleOpenBoard}
        onCopyLink={this.handleCopyLink}
        onPrintQr={this.handlePrintQr}
        onDownloadQr={this.handleDownloadQr}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  isLogged: isLogged(state),
  isAccessClient: !!(getUser(state) || {}).isAccessClient
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AccessDashboardContainer));
