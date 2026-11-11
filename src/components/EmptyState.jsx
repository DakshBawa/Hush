export default function EmptyState({ room, onSeed }) {
  return (
    <div className="card mt-8 p-10 text-center">
      <p className="font-display text-3xl font-extrabold">No doubts yet</p>
      <p className="mx-auto mt-3 max-w-md text-ink/75">
        Ask students to open the Student view and join room <strong>{room}</strong>. Doubts appear here the moment they are sent.
      </p>
      <button onClick={onSeed} className="btn-primary mt-6">Load sample doubts</button>
    </div>
  );
}
