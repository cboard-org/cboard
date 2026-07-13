import {
  trackSyncEvent,
  trackSyncException,
  getManifestWatermark
} from '../Board.sync.analytics';
import { appInsights } from '../../../appInsights';

jest.mock('../../../appInsights', () => ({
  appInsights: {
    trackEvent: jest.fn(),
    trackException: jest.fn()
  }
}));

describe('getManifestWatermark', () => {
  it('returns the newest lastEdited as an ISO string', () => {
    const manifest = [
      { id: 'a', lastEdited: '2026-07-01T10:00:00.000Z' },
      { id: 'b', lastEdited: '2026-07-03T08:30:00.000Z' },
      { id: 'c', lastEdited: '2026-07-02T23:59:59.000Z' }
    ];

    expect(getManifestWatermark(manifest)).toBe('2026-07-03T08:30:00.000Z');
  });

  it('compares by parsed time, not string order', () => {
    const manifest = [
      { id: 'a', lastEdited: '2026-07-03T00:30:00.000+02:00' },
      { id: 'b', lastEdited: '2026-07-02T23:00:00.000Z' }
    ];

    expect(getManifestWatermark(manifest)).toBe('2026-07-02T23:00:00.000Z');
  });

  it('ignores entries with a malformed or missing lastEdited', () => {
    const manifest = [
      { id: 'a', lastEdited: 'not-a-date' },
      { id: 'b' },
      null,
      { id: 'c', lastEdited: '2026-07-01T10:00:00.000Z' }
    ];

    expect(getManifestWatermark(manifest)).toBe('2026-07-01T10:00:00.000Z');
  });

  it('returns null for an empty manifest', () => {
    expect(getManifestWatermark([])).toBeNull();
  });

  it('returns null when no entry has a parseable date', () => {
    expect(getManifestWatermark([{ id: 'a', lastEdited: 'nope' }])).toBeNull();
  });

  it('returns null for a missing or non-array manifest', () => {
    expect(getManifestWatermark()).toBeNull();
    expect(getManifestWatermark(null)).toBeNull();
  });
});

describe('sync telemetry wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('tags every event with the sync feature', () => {
    trackSyncEvent('Sync_BoardsStarted', {
      properties: { manifestWatermark: 'null' },
      measurements: { manifestSize: 0 }
    });

    expect(appInsights.trackEvent).toHaveBeenCalledWith({
      name: 'Sync_BoardsStarted',
      properties: { feature: 'sync', manifestWatermark: 'null' },
      measurements: { manifestSize: 0 }
    });
  });

  it('does not throw when the App Insights SDK throws', () => {
    appInsights.trackEvent.mockImplementation(() => {
      throw new Error('SDK not loaded');
    });

    expect(() => trackSyncEvent('Sync_BoardsStarted')).not.toThrow();
  });

  it('does not throw when trackException throws', () => {
    appInsights.trackException.mockImplementation(() => {
      throw new Error('SDK not loaded');
    });

    expect(() =>
      trackSyncException(new Error('sync failed'), { phase: 'syncBoards' })
    ).not.toThrow();
  });
});
