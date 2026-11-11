import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import StudentView from './components/StudentView.jsx';
import TeacherView from './components/TeacherView.jsx';
import useDoubtStore from './useDoubtStore.js';
import { clusterDoubts } from './utils.js';

const DEFAULT_ROOM = 'CLASS-101';

export default function App() {
  const [role, setRole] = useState('student');
  const [roomInput, setRoomInput] = useState(() => {
    try { return window.localStorage.getItem('hush:room') || DEFAULT_ROOM; } catch { return DEFAULT_ROOM; }
  });
  const room = roomInput || DEFAULT_ROOM;

  useEffect(() => {
    try { window.localStorage.setItem('hush:room', roomInput); } catch { /* ignore */ }
  }, [roomInput]);

  const store = useDoubtStore(room);
  const clusters = useMemo(() => clusterDoubts(store.doubts), [store.doubts]);

  return (
    <>
      <Navbar role={role} onRole={setRole} room={roomInput} onRoom={setRoomInput} />
      {role === 'student' ? (
        <StudentView clusters={clusters} me={store.me} onAsk={store.ask} onMeToo={store.meToo} onPulse={store.tapPulse} />
      ) : (
        <TeacherView
          room={room}
          doubts={store.doubts}
          clusters={clusters}
          pulse={store.pulse}
          onAnswer={store.setAnswered}
          onSeed={store.seed}
          onReset={store.reset}
        />
      )}
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-sm text-ink/60">
        Frontend only: doubts are stored in this browser. Open the Teacher view in another tab to watch them arrive live.
      </footer>
    </>
  );
}
