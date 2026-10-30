# Institutional access

The English /institutional-access page uses the existing Cboard login and API client. It accepts a single-use invitation, displays renewal consent, opens actual provider approval and recovers the logged-in account activation after refresh. Individual payers can request cancellation of their renewal. API flags and keys are server-only; see cboard-api/docs/institutional-licensing.md.

The subscription selector enforces local institutional start/end dates. Institutional access has zero offline grace, while ordinary subscriptions retain their existing behavior. Deploy with the corresponding Cboard API integration disabled until staging login, premium access, expiry and cancellation are validated.
