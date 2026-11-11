const COLORS = ['text-violet', 'text-coral', 'text-sky', 'text-ink', 'text-mint'];

export default function KeywordCloud({ words }) {
  if (!words.length) return null;
  const max = Math.max(...words.map((w) => w.count));

  return (
    <section className="card p-5">
      <h3 className="font-display text-xl font-bold">Words that keep coming up</h3>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        {words.map((w, i) => (
          <span
            key={w.word}
            className={`font-display font-bold ${COLORS[i % COLORS.length]}`}
            style={{ fontSize: `${14 + (w.count / max) * 18}px` }}
            title={`${w.count} mention${w.count === 1 ? '' : 's'}`}
          >
            {w.word}
          </span>
        ))}
      </div>
    </section>
  );
}
