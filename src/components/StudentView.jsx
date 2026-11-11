import AskForm from './AskForm.jsx';
import PulseButtons from './PulseButtons.jsx';
import SimilarDoubts from './SimilarDoubts.jsx';

export default function StudentView({ clusters, me, onAsk, onMeToo, onPulse }) {
  const open = clusters.filter((c) => !c.answered).sort((a, b) => b.askers - a.askers).slice(0, 5);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <section className="pb-8 pt-12">
        <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.05] sm:text-7xl">
          Ask without raising your hand.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink/75">
          No name, no login. Your teacher sees the doubts that come up most, never who asked.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AskForm clusters={clusters} voted={me.voted} onAsk={onAsk} onMeToo={onMeToo} />
        </div>
        <aside className="space-y-6 lg:col-span-2">
          <PulseButtons current={me.pulse} onPulse={onPulse} />
          <SimilarDoubts
            title="Asked in this room"
            hint="Same doubt? Tap Me too instead of asking again."
            items={open}
            voted={me.voted}
            onMeToo={onMeToo}
          />
        </aside>
      </div>
    </main>
  );
}
