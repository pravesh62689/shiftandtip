import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAdSenseReadiness, countWords } from '../scripts/track-adsense.mjs';

test('AdSense tracker: NOT ready when 0 substantial posts even if theme/trust live', () => {
  const res = evaluateAdSenseReadiness({
    substantialCount: 0,
    themeLive: true,
    trustPagesLive: true,
    hasPendingVerification: false,
  });
  assert.equal(res.ready, false);
  assert.ok(res.reasons.some((r) => r.includes('0/20')));
});

test('AdSense tracker: NOT ready when pending verification or theme missing', () => {
  const res = evaluateAdSenseReadiness({
    substantialCount: 22,
    themeLive: false,
    trustPagesLive: true,
    hasPendingVerification: true,
  });
  assert.equal(res.ready, false);
  assert.equal(res.reasons.length, 2);
});

test('AdSense tracker: READY only when >=20 substantial posts, theme & trust live, zero pending', () => {
  const res = evaluateAdSenseReadiness({
    substantialCount: 20,
    themeLive: true,
    trustPagesLive: true,
    hasPendingVerification: false,
  });
  assert.equal(res.ready, true);
  assert.equal(res.reasons.length, 0);
});

test('countWords strips HTML tags and counts substantive words', () => {
  assert.equal(countWords('<h2>Hello</h2><p>World one two</p>'), 4);
  assert.equal(countWords(''), 0);
});
