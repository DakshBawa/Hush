export default function StatCards({ doubts, clusters }) {
  const stats = [
    { label: 'Questions received', value: doubts.length, tone: 'bg-sky' },
    { label: 'Distinct doubts', value: clusters.length, tone: 'bg-violet' },
    { label: 'Still open', value: clusters.filter((c) => !c.answered).length, tone: 'bg-coral' },
    { label: 'Me too votes', value: doubts.reduce((n, d) => n + (d.meToo || 0), 0), tone: 'bg-mint' },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="card flex items-center gap-4 p-4">
          <span className={`h-10 w-2 rounded-full ${s.tone}`} />
          <div>
            <p className="font-display text-3xl font-extrabold leading-none">{s.value}</p>
            <p className="mt-1 text-sm text-ink/70">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
