import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { loadLocaleData } from '../../i18n';

export class LanguageProvider extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: null
    };
  }

  componentWillMount() {
    const { locale } = this.props;
    this.fetchMessages(locale);
  }

  componentWillReceiveProps(nextProps) {
    const { locale } = nextProps;
    this.fetchMessages(locale);
  }

  fetchMessages(locale) {
    this.setState({ messages: null });

    loadLocaleData(locale).then(messages => {
      this.setState({ messages });
    });
  }

  render() {
    const { locale, children } = this.props;
    if (!this.state.messages) {
      return null;
    }

    return (
      <IntlProvider locale={locale} key={locale} messages={this.state.messages}>
        {React.Children.only(children)}
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    locale: state.language.locale
  };
};

export default connect(mapStateToProps)(LanguageProvider);
