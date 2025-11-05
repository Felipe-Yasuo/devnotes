import "./Home.css";
import { usePersistentState } from "../hooks/usePersistentState";
import { useState, useMemo } from "react";

export default function Home() {
    const STORAGE_KEY = "@devnotes:notes";
    const [notes, setNotes] = usePersistentState(STORAGE_KEY, []);

    const [title, setTitle] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [filter, setFilter] = useState("")
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

        setNotes((prev) => [newNote, ...prev]);
        setTitle("");
        setTagsInput("");
        setError("");
    }

    const filteredNotes = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return notes;

        return notes.filter(
            (n) =>
                n.title.toLowerCase().includes(q) ||
                n.tags.some((tag) => tag.toLowerCase().includes(q))
        );
    }, [filter, notes]);

    function handleClearFilter() {
        setFilter("");
    }

    function handleTagClick(tag) {
        setFilter(tag);
    }

    function handleDelete(id) {
        const noteElement = document.querySelector(`.note-item[data-id="${id}"]`);
        if (!noteElement) return;

        noteElement.classList.add("fade-out");

        setTimeout(() => {
            setNotes((prev) => prev.filter((note) => note.id !== id));
        }, 300);
    }


    return (


        <div className="home">
            <header className="home-header">
                <h1>DevNotes</h1>
            </header>


            <div className="search-area">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Buscar por título ou tag..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />

                {filter && (
                    <button className="clear-btn" onClick={handleClearFilter}>
                        Limpar filtro
                    </button>
                )}
            </div>

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
                {filteredNotes.length === 0 ? (
                    <p className="empty-message">Nenhuma nota encontrada 😕</p>
                ) : (
                    filteredNotes.map((note) => (
                        <li key={note.id} className="note-item" data-id={note.id}>
                            <div className="note-header">
                                <strong>{note.title}</strong>
                                <button className="delete-btn" onClick={() => handleDelete(note.id)}>✕</button>
                            </div>
                            {note.tags.length > 0 && (
                                <div className="note-tags">
                                    {note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`tag ${filter.toLowerCase() === tag.toLowerCase()
                                                ? "active-tag"
                                                : ""
                                                }`}
                                            onClick={() => handleTagClick(tag)}
                                        >#{tag}</span>
                                    ))}
                                </div>
                            )}
                            <small>{new Date(note.createdAt).toLocaleString()}</small>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
