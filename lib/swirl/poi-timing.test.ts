import { describe, expect, it } from 'vitest';
import { formatPoiCountdown, nextPendingPoiReviewAt, notePoiLabel } from './poi-timing';

describe('PPOI waiting-period UI', () => {
  const now = Date.UTC(2026, 9, 30, 12, 0, 0);

  it('shows the remaining mainnet waiting period', () => {
    const reviewAt = now + 61 * 60 * 1000 + 2_000;
    expect(formatPoiCountdown(reviewAt, now)).toBe('PPOI wait · 1h 1m 2s');
  });

  it('changes to review status when the waiting period ends', () => {
    expect(formatPoiCountdown(now - 1, now)).toBe('Reviewing PPOI…');
    expect(notePoiLabel({ spent: false, poiStatus: 'ShieldPending', poiReviewAt: now }, now)).toBe('Reviewing PPOI…');
  });

  it('keeps a useful fallback when block time is unavailable', () => {
    expect(notePoiLabel({ spent: false, poiStatus: 'ShieldPending' }, now)).toBe('PPOI waiting period');
  });

  it('marks valid notes available', () => {
    expect(notePoiLabel({ spent: false, poiStatus: 'Valid' }, now)).toBe('Available');
  });

  it('prioritizes spent status over PPOI status', () => {
    expect(notePoiLabel({ spent: true, poiStatus: 'ShieldPending', poiReviewAt: now + 3_600_000 }, now)).toBe('Spent');
  });

  it('uses the earliest unspent pending review time', () => {
    expect(nextPendingPoiReviewAt([
      { spent: false, poiStatus: 'ShieldPending', poiReviewAt: now + 7_200_000 },
      { spent: false, poiStatus: 'Valid', poiReviewAt: now + 1_000 },
      { spent: true, poiStatus: 'ShieldPending', poiReviewAt: now + 2_000 },
      { spent: false, poiStatus: 'ShieldPending', poiReviewAt: now + 3_600_000 },
    ])).toBe(now + 3_600_000);
  });
});
