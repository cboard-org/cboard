import { appInsights } from '../../appInsights';
import { SYNC_STATUS } from './Board.constants';

// All sync telemetry carries `feature: "sync"` so customEvents and exceptions
// join cleanly in Kusto. appInsights auto-disables in development.
const FEATURE = 'sync';

/**
 * Thin wrapper over appInsights.trackEvent for the sync engine rollout telemetry.
 * Numeric counts go in `measurements` (customMeasurements); categorical context
 * goes in `properties` (customDimensions). See docs/sync-telemetry.md.
 */
export function trackSyncEvent(name, { properties = {}, measurements } = {}) {
  appInsights.trackEvent({
    name,
    properties: { feature: FEATURE, ...properties },
    measurements
  });
}

/**
 * Surface a sync failure in the cloud `exceptions` table. The sync catch blocks
 * otherwise only console.error, which is invisible once deployed.
 */
export function trackSyncException(error, properties = {}) {
  appInsights.trackException({
    exception: error instanceof Error ? error : new Error(String(error)),
    properties: { feature: FEATURE, ...properties }
  });
}

/** Count boards currently marked PENDING (not deleted) in a syncMeta map. */
export function countPendingBoards(syncMeta = {}) {
  return Object.values(syncMeta).filter(
    meta => meta?.status === SYNC_STATUS.PENDING && !meta?.isDeleted
  ).length;
}
