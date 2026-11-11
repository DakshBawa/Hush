export default function SimilarDoubts({ title, hint, items, voted, onMeToo }) {
  if (!items.length) return null;

  return (
    <section className="card p-5">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      {hint && <p className="mt-1 text-sm text-ink/70">{hint}</p>}
      <ul className="mt-3 divide-y divide-mist">
        {items.map((c) => {
          const done = voted.includes(c.id);
          return (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium leading-snug">{c.text}</p>
                <p className="text-sm text-ink/60">
                  {c.askers} {c.askers === 1 ? 'student' : 'students'} asking
                </p>
              </div>
              <button
                onClick={() => onMeToo(c.id)}
                disabled={done}
                aria-pressed={done}
                className="btn-ghost shrink-0 disabled:opacity-60"
              >
                {done ? 'Added' : 'Me too'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
