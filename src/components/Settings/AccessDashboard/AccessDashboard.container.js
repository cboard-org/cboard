import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import API from '../../../api';
import AccessDashboard from './AccessDashboard.component';
import { getAccessPath } from './accessGates';
import { showNotification } from '../../Notifications/Notifications.actions';
import messages from './AccessDashboard.messages';

export class AccessDashboardContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    history: PropTypes.object.isRequired,
    showNotification: PropTypes.func.isRequired
  };

  state = {
    clients: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchClients();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

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
      await navigator.clipboard.writeText(url);
      showNotification(intl.formatMessage(messages.linkCopied));
    } catch (e) {
      showNotification(intl.formatMessage(messages.copyLinkFailed), 'error');
    }
  };

  render() {
    const { intl, history } = this.props;
    const { clients, loading, error } = this.state;

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
      />
    );
  }
}

const mapDispatchToProps = {
  showNotification
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(AccessDashboardContainer));
