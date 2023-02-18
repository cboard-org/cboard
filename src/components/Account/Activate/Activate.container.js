import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activate } from './Activate.actions';
import './Activate.css';

function ActivateContainer({
  match: {
    params: { url }
  }
}) {
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState({});

  useEffect(
    () => {
      setIsActivating(true);

      activate(url)
        .then(response => setActivationStatus(response))
        .catch(error => setActivationStatus(error))
        .finally(() => setIsActivating(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="Activate">
      {isActivating ? (
        'Activating your account...'
      ) : (
        <>
          <div>{activationStatus.message}</div>

          <Link to="/" className="Activate_home">
            Home page
          </Link>
        </>
      )}
    </div>
  );
}

export default ActivateContainer;
