const OPTIONS = [
  { id: 'fast', label: 'Too fast', dot: 'bg-sun' },
  { id: 'lost', label: "I'm lost", dot: 'bg-coral' },
  { id: 'clear', label: 'All clear', dot: 'bg-mint' },
];

export default function PulseButtons({ current, onPulse }) {
  return (
    <section className="card p-5">
      <h3 className="font-display text-xl font-bold">How is the pace?</h3>
      <p className="mt-1 text-sm text-ink/70">One tap, anonymous. Tap again to take it back.</p>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Class pace">
        {OPTIONS.map((o) => (
          <button key={o.id} onClick={() => onPulse(o.id)} aria-pressed={current === o.id} className="chip flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${o.dot}`} />
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
