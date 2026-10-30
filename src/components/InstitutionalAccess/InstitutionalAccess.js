import React, { useState } from 'react';
import API from '../../api/api';

export default function InstitutionalAccess() {
  const [token, setToken] = useState(''),
    [terms, setTerms] = useState(null),
    [accepted, setAccepted] = useState(false),
    [activation, setActivation] = useState(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const run = async (action, body) => {
    setBusy(true);
    setError('');
    try {
      const result = await API.institutionalActivation(action, body);
      if (action === 'preview') setTerms(result);
      else if (['status', 'redeem'].includes(action)) setActivation(result);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main lang="en" style={{ maxWidth: 720, margin: 'auto', padding: 24 }}>
      <a href="/">← Back to Cboard</a>
      <h1>Activate institutional access</h1>
      <p>
        Sign in to the account invited by your institution. Existing paid access
        needs review before another subscription is created.
      </p>
      {error && <p role="alert">{error}</p>}
      {!activation && (
        <button disabled={busy} onClick={() => run('status', {})}>
          Find my existing activation
        </button>
      )}
      {!activation && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run('preview', { token });
          }}
        >
          <label>
            Single-use invitation token
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              autoComplete="off"
            />
          </label>
          <button disabled={busy}>Review invitation</button>
        </form>
      )}
      {terms && !activation && (
        <section>
          <h2>Review renewal terms</h2>
          <p>
            Payer: {terms.payer}. Annual price: USD{' '}
            {(terms.annualPrice / 100).toFixed(2)}. First charge:{' '}
            {terms.firstChargeRule}. {terms.cancellationMethod}
          </p>
          {terms.payer === 'individual' && (
            <label>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              I authorize the agreed annual renewal after the sponsored term and
              will approve the payment method with the provider.
            </label>
          )}
          <button
            disabled={busy || (terms.payer === 'individual' && !accepted)}
            onClick={() =>
              run('redeem', {
                token,
                consent:
                  terms.payer === 'individual'
                    ? {
                        accepted: true,
                        agreementVersion: terms.version,
                        annualPrice: terms.annualPrice,
                        currency: 'USD',
                        frequency: 'annual',
                        firstChargeRule: terms.firstChargeRule
                      }
                    : undefined
              })
            }
          >
            Redeem invitation
          </button>
        </section>
      )}
      {activation && (
        <section>
          <h2>Activation status</h2>
          <p role="status">{activation.state}</p>
          {activation.payer === 'individual' &&
            activation.end &&
            !activation.cancelAtPeriodEnd && (
              <button
                disabled={busy}
                onClick={async () => {
                  await run('cancel', {
                    assignmentId: activation.assignmentId
                  });
                  await run('status', {
                    assignmentId: activation.assignmentId
                  });
                }}
              >
                Request cancellation of renewal
              </button>
            )}
          {activation.cancelAtPeriodEnd && (
            <p>
              Renewal cancellation is recorded. Access continues through its
              entitled end.
            </p>
          )}
          {activation.state === 'awaiting_authorization' && (
            <button
              disabled={busy}
              onClick={() =>
                run('retry', { assignmentId: activation.assignmentId })
              }
            >
              Recover expired approval
            </button>
          )}
          {activation.approvalUrl && (
            <a href={activation.approvalUrl}>Complete payer approval</a>
          )}
          <button
            disabled={busy}
            onClick={async () => {
              await run('check', { assignmentId: activation.assignmentId });
              await run('status', { assignmentId: activation.assignmentId });
            }}
          >
            Check approval and access
          </button>
          {activation.end && (
            <p>
              Access ends {new Date(activation.end).toLocaleString('en-US')}.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
