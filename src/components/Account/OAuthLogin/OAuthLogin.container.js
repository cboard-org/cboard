import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { login } from '../Login/Login.actions';
import messages from './OAuthLogin.messages';
import { getUser } from '../../App/App.selectors';
import './OAuthLogin.css';

class OAuthLoginContainer extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    user: PropTypes.object,
    login: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {
      match: {
        params: { type }
      },
      location: { search: query },
      history
    } = this.props;

    this.type = type;
    this.query = query;
    this.hasErrors = query.indexOf('error=') >= 0;

    if (this.hasErrors) {
      setTimeout(() => {
        history.replace('/');
      }, 3000);
    }
  }

  componentDidMount() {
    if (!this.checkUser()) {
      this.props.login({ email: this.type, password: this.query }, this.type);
    }
  }

  componentDidUpdate() {
    this.checkUser();
  }

  checkUser() {
    const { history, user } = this.props;
    if (user.email) {
      history.replace('/');
    }

    return !!user.email;
  }

  render() {
    return (
      <div className="OAuthContainer">
        {!this.hasErrors && <FormattedMessage {...messages.loading} />}
        {this.hasErrors && <FormattedMessage {...messages.errorMessage} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: getUser(state)
});

const mapDispatchToProps = {
  login
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(OAuthLoginContainer));
