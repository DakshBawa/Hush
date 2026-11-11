import { useState } from 'react';
import StatCards from './StatCards.jsx';
import ClusterCard from './ClusterCard.jsx';
import KeywordCloud from './KeywordCloud.jsx';
import PulseMeter from './PulseMeter.jsx';
import EmptyState from './EmptyState.jsx';
import { useNow } from '../useDoubtStore.js';
import { keywordFreq } from '../utils.js';

const TABS = [['open', 'Open'], ['answered', 'Answered'], ['all', 'All']];

export default function TeacherView({ room, doubts, clusters, pulse, onAnswer, onSeed, onReset }) {
  const [tab, setTab] = useState('open');
  const now = useNow();

  const visible = clusters
    .filter((c) => tab === 'all' || (tab === 'open' ? !c.answered : c.answered))
    .sort((a, b) => Number(a.answered) - Number(b.answered) || b.askers - a.askers || b.lastTs - a.lastTs);

  const toggle = (c) => onAnswer(c.members.map((m) => m.id), !c.answered);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Live doubts</h1>
          <p className="mt-2 flex items-center gap-2 text-ink/75">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
            </span>
            Live. Students join with room code <strong className="text-ink">{room}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onSeed} className="btn-ghost">Load sample doubts</button>
          <button onClick={onReset} className="btn-ghost">Clear room</button>
        </div>
      </div>

      <StatCards doubts={doubts} clusters={clusters} />

      {doubts.length === 0 ? (
        <EmptyState room={room} onSeed={onSeed} />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2" aria-label="Doubts">
            <div role="group" aria-label="Filter" className="flex gap-2">
              {TABS.map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id} className="chip">{label}</button>
              ))}
            </div>
            {visible.length === 0 && <p className="card p-6 text-ink/70">Nothing here. Switch the filter to see the rest.</p>}
            {visible.map((c) => (
              <ClusterCard key={c.id} c={c} now={now} onToggle={toggle} />
            ))}
          </section>

          <aside className="space-y-6">
            <PulseMeter pulse={pulse} />
            <KeywordCloud words={keywordFreq(doubts)} />
          </aside>
        </div>
      )}
    </main>
  );
}
