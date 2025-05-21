'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const notesListElement = document.getElementById('notesList');
    const newNoteBtn = document.getElementById('newNoteBtn');
    const noteEditorElement = document.getElementById('noteEditor');
    const noteEditorTitle = document.getElementById('noteEditorTitle');
    const noteEditorContent = document.getElementById('noteEditorContent');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const deleteNoteBtn = document.getElementById('deleteNoteBtn');
    const placeholderView = document.getElementById('placeholderView');

    // Application State
    let notes = [];
    let selectedNoteId = null;

    // --- Helper Functions ---
    /**
     * Generates a unique ID for a new note.
     * @returns {string} A unique ID.
     */
    function generateId() {
        return Date.now().toString() + Math.random().toString(36).substring(2, 9);
    }

    /**
     * Creates a short preview of the note content.
     * @param {string} content - The full content of the note.
     * @param {number} maxLength - The maximum length of the preview.
     * @returns {string} A preview string.
     */
    function getNotePreview(content, maxLength = 40) {
        if (!content) return 'No additional content.';
        const cleanedContent = content.replace(/\n/g, ' '); // Replace newlines with spaces for preview
        if (cleanedContent.length <= maxLength) return cleanedContent;
        return cleanedContent.substring(0, maxLength).trim() + '...';
    }

    // --- Data Persistence Functions ---
    /**
     * Loads notes from Local Storage.
     */
    function loadNotes() {
        const storedNotes = localStorage.getItem('simple-notes-app-data');
        if (storedNotes) {
            notes = JSON.parse(storedNotes);
        }
    }

    /**
     * Saves the current notes array to Local Storage.
     */
    function saveNotes() {
        localStorage.setItem('simple-notes-app-data', JSON.stringify(notes));
    }

    // --- UI Rendering Functions ---
    /**
     * Renders the list of notes in the sidebar.
     */
    function renderNotesList() {
        notesListElement.innerHTML = ''; // Clear existing list
        if (notes.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.className = 'notes-list-empty';
            emptyMsg.textContent = 'No notes yet. Create one!';
            notesListElement.appendChild(emptyMsg);
            return;
        }

        notes.forEach(note => {
            const listItem = document.createElement('li');
            listItem.className = 'note-item';
            listItem.dataset.noteId = note.id;

            const titleElement = document.createElement('h3');
            titleElement.className = 'note-item-title';
            titleElement.textContent = note.title || 'Untitled Note';

            const previewElement = document.createElement('p');
            previewElement.className = 'note-item-preview';
            previewElement.textContent = getNotePreview(note.content);
            
            listItem.appendChild(titleElement);
            listItem.appendChild(previewElement);

            if (note.id === selectedNoteId) {
                listItem.classList.add('active');
            }

            listItem.addEventListener('click', () => handleNoteItemClick(note.id));
            notesListElement.appendChild(listItem);
        });
    }

    /**
     * Displays the note editor with the content of the given note.
     * @param {object} note - The note object to display.
     */
    function populateEditor(note) {
        if (note) {
            noteEditorTitle.value = note.title || '';
            noteEditorContent.value = note.content || '';
            selectedNoteId = note.id;
        } else {
            noteEditorTitle.value = '';
            noteEditorContent.value = '';
            selectedNoteId = null;
        }
    }

    /**
     * Shows the note editor and hides the placeholder.
     */
    function showEditorView() {
        noteEditorElement.style.display = 'flex'; // Assuming editor uses flex
        placeholderView.style.display = 'none';
        saveNoteBtn.disabled = false;
        deleteNoteBtn.disabled = selectedNoteId === null; // Enable only if a note is truly selected
    }

    /**
     * Shows the placeholder view and hides the note editor.
     */
    function showPlaceholderView() {
        noteEditorElement.style.display = 'none';
        placeholderView.style.display = 'flex'; // Assuming placeholder uses flex
        saveNoteBtn.disabled = true;
        deleteNoteBtn.disabled = true;
        selectedNoteId = null;
        renderNotesList(); // To remove active class from list
    }

    // --- Event Handlers ---
    /**
     * Handles the click event on the 'New Note' button.
     */
    function handleNewNoteClick() {
        const newNote = {
            id: generateId(),
            title: 'New Note',
            content: ''
        };
        notes.unshift(newNote); // Add to the beginning of the array
        selectedNoteId = newNote.id;
        saveNotes();
        renderNotesList();
        populateEditor(newNote);
        showEditorView();
        noteEditorTitle.focus();
    }

    /**
     * Handles the click event on a note item in the list.
     * @param {string} noteId - The ID of the clicked note.
     */
    function handleNoteItemClick(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            selectedNoteId = note.id;
            populateEditor(note);
            showEditorView();
            renderNotesList(); // Re-render to update active class
        }
    }

    /**
     * Handles the click event on the 'Save Note' button.
     */
    function handleSaveNoteClick() {
        if (!selectedNoteId) return; // Should not happen if button is enabled correctly

        const note = notes.find(n => n.id === selectedNoteId);
        if (note) {
            note.title = noteEditorTitle.value.trim();
            note.content = noteEditorContent.value; // Not trimming content by default

            if (!note.title) {
                note.title = 'Untitled Note'; // Default title if empty
            }

            saveNotes();
            renderNotesList(); // Update list view (e.g., title or preview might have changed)
            // Optionally, add a visual confirmation for save
        }
    }

    /**
     * Handles the click event on the 'Delete Note' button.
     */
    function handleDeleteNoteClick() {
        if (!selectedNoteId) return;

        // Confirmation dialog
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== selectedNoteId);
            saveNotes();
            selectedNoteId = null;
            populateEditor(null); // Clear editor
            showPlaceholderView(); // Show placeholder as no note is selected
            renderNotesList();
        }
    }

    // --- Initialization ---
    /**
     * Initializes the application: loads notes, renders the list, and sets up event listeners.
     */
    function initialize() {
        loadNotes();
        renderNotesList();
        showPlaceholderView(); // Start with placeholder

        newNoteBtn.addEventListener('click', handleNewNoteClick);
        saveNoteBtn.addEventListener('click', handleSaveNoteClick);
        deleteNoteBtn.addEventListener('click', handleDeleteNoteClick);
    }

    initialize();
});
