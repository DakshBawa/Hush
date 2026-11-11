export default function Navbar({ role, onRole, room, onRoom }) {
  return (
    <header className="sticky top-0 z-20 border-b border-mist bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3" aria-label="Main">
        <div className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-violet text-base text-white">h</span>
          hush
        </div>

        <div role="group" aria-label="View" className="inline-flex rounded-full bg-white p-1 ring-1 ring-mist">
          {['student', 'teacher'].map((r) => (
            <button
              key={r}
              onClick={() => onRole(r)}
              aria-pressed={role === r}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                role === r ? 'bg-ink text-white' : 'text-ink/70 hover:text-ink'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          Room
          <input
            value={room}
            onChange={(e) => onRoom(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12))}
            className="w-32 rounded-full bg-white px-3 py-1.5 font-bold tracking-wide ring-1 ring-mist focus:ring-2 focus:ring-violet"
          />
        </label>
      </nav>
    </header>
  );
}
