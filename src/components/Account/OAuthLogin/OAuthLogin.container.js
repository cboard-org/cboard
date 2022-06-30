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
      location: { search: query }
    } = this.props;

    this.type = type;
    this.query = query;
    this.state = {
      hasErrors: query.indexOf('error=') >= 0
    };
  }

  componentDidMount() {
    const { hasErrors } = this.state;
    if (hasErrors) {
      this.handleError();
      return;
    }

    if (!this.checkUser()) {
      this.props
        .login({ email: this.type, password: this.query }, this.type)
        .catch(error => {
          this.handleError();
        });
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

  handleError() {
    const { history } = this.props;
    this.setState({ hasErrors: true });
    setTimeout(() => {
      history.replace('/login-signup');
    }, 3000);
  }

  render() {
    const { hasErrors } = this.state;
    return (
      <div className="OAuthContainer">
        {!hasErrors && <FormattedMessage {...messages.loading} />}
        {hasErrors && <FormattedMessage {...messages.errorMessage} />}
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
