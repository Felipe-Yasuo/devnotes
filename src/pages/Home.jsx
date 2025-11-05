import "./Home.css";
import { usePersistentState } from "../hooks/usePersistentState";

export default function Home() {
    const STORAGE_KEY = "@devnotes:notes";
    const [notes, setNotes] = usePersistentState(STORAGE_KEY, []);

    function handleAddNote() {
        const newNote = {
            id: Date.now(),
            title: `Nova nota ${notes.length + 1}`,
        };
        setNotes((prev) => [newNote, ...prev]);
    }

    return (
        <div className="home">
            <header className="home-header">
                <h1>🧠 DevNotes</h1>
                <button onClick={handleAddNote}>+ Adicionar nota</button>
            </header>

            <pre className="notes-view">{JSON.stringify(notes, null, 2)}</pre>
        </div>
    );
}