import { timeAgo } from '../utils.js';

const HEAT = {
  hot: { rail: 'bg-coral', bubble: 'bg-coral text-white' },
  warm: { rail: 'bg-sun', bubble: 'bg-sun text-ink' },
  cool: { rail: 'bg-sky', bubble: 'bg-sky text-white' },
};

export default function ClusterCard({ c, now, onToggle }) {
  const heat = HEAT[c.level];
  const others = c.members.length - 1;

  return (
    <article className={`card flex overflow-hidden ${c.answered ? 'opacity-60' : ''}`}>
      <div className={`w-2 shrink-0 ${c.answered ? 'bg-mist' : heat.rail}`} />
      <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row">
        <div
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-center ${
            c.answered ? 'bg-mist text-ink' : heat.bubble
          }`}
        >
          <div>
            <p className="font-display text-2xl font-extrabold leading-none">{c.askers}</p>
            <p className="text-[11px] font-semibold">asked</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold leading-snug">{c.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink/70">
            {c.keywords.map((k) => (
              <span key={k} className="badge">{k}</span>
            ))}
            <span>First asked {timeAgo(c.firstTs, now)}</span>
          </div>
          {others > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer font-semibold text-violet">
                {others} other {others === 1 ? 'phrasing' : 'phrasings'}
              </summary>
              <ul className="mt-2 space-y-1 border-l-2 border-mist pl-3">
                {c.members.slice(1).map((m) => (
                  <li key={m.id}>{m.text}</li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <button onClick={() => onToggle(c)} className={`self-start ${c.answered ? 'btn-ghost' : 'btn-primary'}`}>
          {c.answered ? 'Reopen' : 'Mark answered'}
        </button>
      </div>
    </article>
  );
}
