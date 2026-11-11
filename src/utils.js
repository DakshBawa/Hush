// Pure helpers: tokenizing, grouping similar doubts, time, sample data.

const STOP = new Set(
  ('a an the is are was were be been am do does did to of in on at for with and or but if so as it its this that ' +
    'these those i me my we you your they them he she what why how when where which who can could would should ' +
    'will shall please sir madam mam explain again once more just also not no yes about into from by than then ' +
    'there here have has had get got any some very much show tell exactly different difference between ' +
    'one two three four five example examples need needs happen happens code mean means meaning understand didn dont missed').split(' ')
);

export const SIMILAR_AT = 0.4;
export const uid = () => Math.random().toString(36).slice(2, 9);

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => {
      if (w.length > 5 && /(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
      return w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w;
    });
}

function dice(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return (2 * shared) / (a.size + b.size);
}

const bestScore = (set, sets) => Math.max(0, ...sets.map((s) => dice(set, s)));

function finish(c) {
  const freq = {};
  c.sets.forEach((s) => s.forEach((t) => (freq[t] = (freq[t] || 0) + 1)));
  const askers = c.members.reduce((n, m) => n + 1 + (m.meToo || 0), 0);
  return {
    ...c,
    text: c.members[0].text,
    askers,
    answered: c.members.every((m) => m.answered),
    keywords: Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w),
    firstTs: Math.min(...c.members.map((m) => m.ts)),
    lastTs: Math.max(...c.members.map((m) => m.ts)),
    level: askers >= 4 ? 'hot' : askers >= 2 ? 'warm' : 'cool',
  };
}

// Groups doubts that are worded differently but mean the same thing.
export function clusterDoubts(doubts) {
  const clusters = [];
  for (const d of [...doubts].sort((a, b) => a.ts - b.ts)) {
    const set = new Set(tokenize(d.text));
    let best = null;
    let top = 0;
    for (const c of clusters) {
      const s = bestScore(set, c.sets);
      if (s > top) { top = s; best = c; }
    }
    if (best && top >= SIMILAR_AT) { best.members.push(d); best.sets.push(set); }
    else clusters.push({ id: d.id, members: [d], sets: [set] });
  }
  return clusters.map(finish);
}

// Existing doubts that look like what a student is typing right now.
export function findSimilar(text, clusters, limit = 3) {
  const set = new Set(tokenize(text));
  if (!set.size) return [];
  return clusters
    .map((c) => ({ c, s: bestScore(set, c.sets) }))
    .filter((x) => x.s >= 0.34)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.c);
}

export function keywordFreq(doubts, n = 14) {
  const freq = {};
  doubts.forEach((d) => tokenize(d.text).forEach((t) => (freq[t] = (freq[t] || 0) + 1)));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

export function timeAgo(ts, now = Date.now()) {
  const s = Math.floor((now - ts) / 1000);
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

// Sample doubts so the teacher dashboard has something to show.
const SAMPLE = [
  ['What exactly is a deadlock and how is it different from starvation?', 14, 2],
  ["I didn't get how deadlock happens with two processes", 12, 1],
  ['Can you show an example of deadlock in code?', 9, 0],
  ["Why does the banker's algorithm need maximum demand in advance?", 8, 0],
  ['What is the difference between paging and segmentation?', 7, 1],
  ['Paging vs segmentation, which one do modern systems use?', 5, 0],
  ['Please repeat the page table formula, I missed it', 4, 0],
  ['How does round robin choose the time quantum?', 3, 0],
  ['What happens if the time quantum is too large in round robin?', 2, 0],
  ['Is thrashing related to paging?', 1, 0],
];

export const sampleDoubts = () =>
  SAMPLE.map(([text, minsAgo, meToo]) => ({
    id: uid(), text, tag: null, ts: Date.now() - minsAgo * 60000, meToo, answered: false,
  }));
