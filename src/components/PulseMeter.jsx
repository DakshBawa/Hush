const ROWS = [
  { id: 'fast', label: 'Too fast', bar: 'bg-sun' },
  { id: 'lost', label: "I'm lost", bar: 'bg-coral' },
  { id: 'clear', label: 'All clear', bar: 'bg-mint' },
];

export default function PulseMeter({ pulse }) {
  const total = ROWS.reduce((n, r) => n + pulse[r.id], 0);

  return (
    <section className="card p-5">
      <h3 className="font-display text-xl font-bold">Class pace</h3>
      <p className="mt-1 text-sm text-ink/70">{total === 0 ? 'No signals yet.' : `${total} student signal${total === 1 ? '' : 's'}`}</p>
      <ul className="mt-4 space-y-3">
        {ROWS.map((r) => (
          <li key={r.id}>
            <div className="flex justify-between text-sm font-semibold">
              <span>{r.label}</span>
              <span>{pulse[r.id]}</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-mist">
              <div className={`h-full rounded-full ${r.bar} transition-all`} style={{ width: total ? `${(pulse[r.id] / total) * 100}%` : '0%' }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
