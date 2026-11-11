import { useCallback, useEffect, useState } from 'react';
import { sampleDoubts, uid } from './utils.js';

// No backend: doubts live in localStorage, keyed by room code. The `storage`
// event keeps other tabs of the same browser in sync, so a Teacher tab updates
// live while a Student tab submits.

const EMPTY = { doubts: [], pulse: { fast: 0, lost: 0, clear: 0 } };
const NO_ME = { voted: [], pulse: null };

const load = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

export default function useDoubtStore(room) {
  const key = `hush:${room}`;
  const meKey = `hush:me:${room}`;
  const [data, setData] = useState(() => load(key, EMPTY));
  const [me, setMe] = useState(() => load(meKey, NO_ME));

  useEffect(() => {
    setData(load(key, EMPTY));
    setMe(load(meKey, NO_ME));
    const onStorage = (e) => { if (e.key === key) setData(load(key, EMPTY)); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, meKey]);

  // Always apply a change to the latest stored copy so tabs never overwrite each other.
  const commit = useCallback((fn) => {
    const next = fn(load(key, EMPTY));
    save(key, next);
    setData(next);
  }, [key]);

  const commitMe = useCallback((next) => { save(meKey, next); setMe(next); }, [meKey]);

  const ask = (text, tag) =>
    commit((s) => ({
      ...s,
      doubts: [...s.doubts, { id: uid(), text: text.trim(), tag, ts: Date.now(), meToo: 0, answered: false }],
    }));

  const meToo = (id) => {
    if (me.voted.includes(id)) return;
    commit((s) => ({ ...s, doubts: s.doubts.map((d) => (d.id === id ? { ...d, meToo: (d.meToo || 0) + 1 } : d)) }));
    commitMe({ ...me, voted: [...me.voted, id] });
  };

  const setAnswered = (ids, answered) =>
    commit((s) => ({ ...s, doubts: s.doubts.map((d) => (ids.includes(d.id) ? { ...d, answered } : d)) }));

  // One pulse signal per device; tapping the same one again withdraws it.
  const tapPulse = (type) => {
    const old = me.pulse;
    commit((s) => {
      const pulse = { ...s.pulse };
      if (old) pulse[old] = Math.max(0, pulse[old] - 1);
      if (old !== type) pulse[type] += 1;
      return { ...s, pulse };
    });
    commitMe({ ...me, pulse: old === type ? null : type });
  };

  const seed = () => commit((s) => ({ ...s, doubts: [...s.doubts, ...sampleDoubts()] }));
  const reset = () => { commit(() => EMPTY); commitMe(NO_ME); };

  return { doubts: data.doubts, pulse: data.pulse, me, ask, meToo, setAnswered, tapPulse, seed, reset };
}

// Re-renders on an interval so "5m ago" labels stay fresh.
export function useNow(ms = 30000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}
