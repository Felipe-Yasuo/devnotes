import "./Home.css";
import { usePersistentState } from "../hooks/usePersistentState";
import { useState } from "react";

export default function Home() {
    const STORAGE_KEY = "@devnotes:notes";
    const [notes, setNotes] = usePersistentState(STORAGE_KEY, []);

    const [title, setTitle] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [error, setError] = useState("");

    function handleAddNote(e) {
        e.preventDefault();
        if (!title.trim()) {
            setError("⚠️ O título é obrigatório.");
            return;
        }

        const tags = tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        if (tags.length === 0) {
            setError("⚠️ É obrigatório adicionar pelo menos uma tag.");
            return;
        }

        const newNote = {
            id: Date.now(),
            title: title.trim(),
            tags,
            createdAt: new Date().toISOString(),
        };

        setError("");


        setNotes((prev) => [newNote, ...prev]);
        setTitle("");
        setTagsInput("");
    }

    return (
        <div className="home">
            <header className="home-header">
                <h1>DevNotes</h1>
            </header>

            <form className="note-form" onSubmit={handleAddNote}>
                <input
                    type="text"
                    placeholder="Título da nota..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Tags (separe por vírgula)"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                />

                <button type="submit">+ Adicionar</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <ul className="notes-list">
                {notes.map((note) => (
                    <li key={note.id} className="note-item">
                        <strong>{note.title}</strong>

                        {note.tags.length > 0 && (
                            <div className="note-tags">
                                {note.tags.map((tag) => (
                                    <span key={tag}>#{tag}</span>
                                ))}
                            </div>
                        )}
                        <small>{new Date(note.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
