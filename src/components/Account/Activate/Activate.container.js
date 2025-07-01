import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { activate } from './Activate.actions';
import './Activate.css';

import { FormattedMessage } from 'react-intl';
import messages from './Activate.messages';

function ActivateContainer() {
  const [isActivating, setIsActivating] = useState(true);
  const [isErrorActivating, setIsErrorActivating] = useState(false);

  const { url } = useParams();
  const history = useHistory();

  const redirectToLogin = useCallback(
    () => {
      setTimeout(() => {
        history.replace('/login-signup');
      }, 2000);
    },
    [history]
  );

  const handleError = useCallback(
    () => {
      setIsErrorActivating(true);
      redirectToLogin();
    },
    [redirectToLogin]
  );

  useEffect(
    () => {
      setIsActivating(true);
      activate(url)
        .then(status => {
          if (status.success) {
            redirectToLogin();
          } else {
            handleError();
          }
        })
        .catch(status => {
          handleError();
        })
        .finally(() => setIsActivating(false));
    },
    [url, redirectToLogin, handleError]
  );

  return (
    <div className="Activate">
      {isActivating ? (
        <FormattedMessage {...messages.activating} />
      ) : (
        <Fragment>
          {isErrorActivating ? (
            <FormattedMessage {...messages.error} />
          ) : (
            <FormattedMessage {...messages.success} />
          )}
          <br />
          <Link to="/login-signup" className="Activate_home">
            <FormattedMessage {...messages.loginSignUpPage} />
          </Link>
        </Fragment>
      )}
    </div>
  );
}

export default ActivateContainer;
