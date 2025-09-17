(() => {
    const STORAGE_KEY = 'quicknotes.notes.v1';

    /**
     * @typedef {{ id: string, text: string, createdAt: number }} Note
     */

    const noteTextArea = document.getElementById('noteText');
    const addNoteButton = document.getElementById('addNoteBtn');
    const notesGrid = document.getElementById('notesGrid');

    /** Load notes from localStorage */
    function loadNotes() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(n => n && typeof n.text === 'string');
        } catch (e) {
            console.error('Failed to load notes:', e);
            return [];
        }
    }

    /** Save notes array to localStorage */
    function saveNotes(notes) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        } catch (e) {
            console.error('Failed to save notes:', e);
        }
    }

    /** Create a DOM element for a note card */
    function createNoteCard(note) {
        const card = document.createElement('article');
        card.className = 'note-card';
        card.setAttribute('data-id', note.id);

        const text = document.createElement('div');
        text.className = 'note-text';
        text.textContent = note.text;

        const actions = document.createElement('div');
        actions.className = 'note-actions';

        const dateEl = document.createElement('span');
        dateEl.className = 'note-date';
        dateEl.textContent = new Date(note.createdAt).toLocaleString();

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.type = 'button';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteNote(note.id));

        actions.appendChild(dateEl);
        actions.appendChild(delBtn);

        card.appendChild(text);
        card.appendChild(actions);

        return card;
    }

    /** Render all notes to the grid */
    function renderNotes(notes) {
        notesGrid.innerHTML = '';
        if (!notes.length) {
            const empty = document.createElement('p');
            empty.className = 'note-date';
            empty.textContent = 'No notes yet. Add your first note above!';
            notesGrid.appendChild(empty);
            return;
        }
        const fragment = document.createDocumentFragment();
        for (const note of notes) {
            fragment.appendChild(createNoteCard(note));
        }
        notesGrid.appendChild(fragment);
    }

    /** Add a new note from the textarea */
    function addNote() {
        const text = (noteTextArea.value || '').trim();
        if (!text) return;
        const notes = loadNotes();
        const note = {
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            text,
            createdAt: Date.now()
        };
        notes.unshift(note);
        saveNotes(notes);
        noteTextArea.value = '';
        renderNotes(notes);
        noteTextArea.focus();
    }

    /** Delete a note by id */
    function deleteNote(id) {
        const notes = loadNotes().filter(n => n.id !== id);
        saveNotes(notes);
        renderNotes(notes);
    }

    // Event listeners
    addNoteButton.addEventListener('click', addNote);
    noteTextArea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
            addNote();
        }
    });

    // Initialize
    renderNotes(loadNotes());
})();

