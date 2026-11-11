import { useEffect, useMemo, useState } from 'react';
import SimilarDoubts from './SimilarDoubts.jsx';
import { findSimilar } from '../utils.js';

const TAGS = ['Concept', 'Example', 'Formula', 'Exam'];
const MAX = 280;

export default function AskForm({ clusters, voted, onAsk, onMeToo }) {
  const [text, setText] = useState('');
  const [tag, setTag] = useState(null);
  const [sent, setSent] = useState(false);

  const similar = useMemo(
    () => (text.trim().length >= 4 ? findSimilar(text, clusters.filter((c) => !c.answered)) : []),
    [text, clusters]
  );

  useEffect(() => {
    if (!sent) return undefined;
    const t = setTimeout(() => setSent(false), 4000);
    return () => clearTimeout(t);
  }, [sent]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAsk(text, tag);
    setText('');
    setTag(null);
    setSent(true);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="card p-6">
        <label htmlFor="doubt" className="font-display text-2xl font-bold">What did you not get?</label>
        <textarea
          id="doubt"
          rows={4}
          maxLength={MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type it the way you'd say it. Nobody will see your name."
          className="field mt-3"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Type of doubt">
          {TAGS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tag === t}
              onClick={() => setTag(tag === t ? null : t)}
              className="chip"
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-ink/60">{text.length}/{MAX}</p>
          <button type="submit" disabled={!text.trim()} className="btn-primary">Send anonymously</button>
        </div>

        {sent && (
          <p role="status" className="mt-4 rounded-xl bg-mint/20 px-4 py-3 text-sm font-semibold">
            Sent. Your teacher will see it, and nobody can tell it was you.
          </p>
        )}
      </form>

      <SimilarDoubts
        title="Someone may have asked this already"
        hint="Tap Me too to add your voice instead of repeating it."
        items={similar}
        voted={voted}
        onMeToo={onMeToo}
      />
    </div>
  );
}
