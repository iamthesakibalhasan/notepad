document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('save-button');
    const editButton = document.getElementById('edit-button');
    const deleteButton = document.getElementById('delete-button');
    const noteTextarea = document.getElementById('note');
    const notesDiv = document.getElementById('notes');
    const modal = document.getElementById('note-modal');
    const modalContent = document.getElementById('modal-note-content');
    const closeModal = document.querySelector('.close');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let selectedNoteId = null;

    saveButton.addEventListener('click', saveNote);
    editButton.addEventListener('click', loadNoteForEditing);
    deleteButton.addEventListener('click', deleteNote);
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    renderNotes();

    function saveNote() {
        const noteText = noteTextarea.innerHTML;
        if (noteText.trim()) {
            if (selectedNoteId === null) {
                const newNote = {
                    id: Date.now(),
                    text: noteText,
                    date: new Date().toLocaleString()
                };
                notes.push(newNote);
            } else {
                const note = notes.find(note => note.id === selectedNoteId);
                note.text = noteText;
                note.date = new Date().toLocaleString();
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            noteTextarea.innerHTML = '';
            selectedNoteId = null;
        }
    }

    function loadNoteForEditing() {
        if (selectedNoteId !== null) {
            const note = notes.find(note => note.id === selectedNoteId);
            noteTextarea.innerHTML = note.text;
        }
    }

    function deleteNote() {
        if (selectedNoteId !== null) {
            notes = notes.filter(note => note.id !== selectedNoteId);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            noteTextarea.innerHTML = '';
            selectedNoteId = null;
        }
    }

    function renderNotes() {
        notesDiv.innerHTML = '';
        notes.forEach(addNoteToDOM);
    }

    function addNoteToDOM(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.innerHTML = `<strong>${note.date}</strong><p>${note.text}</p><button class="open-button"><i class="fa-solid fa-book-open"></i></button>`;
        noteDiv.setAttribute('data-note-id', note.id);

        const openButton = noteDiv.querySelector('.open-button');
        openButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the note from being selected when clicking the button
            openNoteInModal(note.id);
        });

        noteDiv.addEventListener('click', (e) => {
            selectNoteDiv(noteDiv, note.id);
        });

        notesDiv.appendChild(noteDiv);
    }

    function selectNoteDiv(selectedNoteDiv, noteId) {
        if (selectedNoteDiv.classList.contains('selected')) {
            selectedNoteDiv.classList.remove('selected');
            selectedNoteId = null;
        } else {
            const previouslySelectedNote = document.querySelector('.note.selected');
            if (previouslySelectedNote) {
                previouslySelectedNote.classList.remove('selected');
            }
            selectedNoteDiv.classList.add('selected');
            selectedNoteId = noteId;
        }
    }

    function openNoteInModal(noteId) {
        const note = notes.find(note => note.id === noteId);
        modalContent.innerHTML = note.text;
        modal.style.display = 'block';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

function formatText(command) {
    document.execCommand(command, false, null);
}

function showPasswordPrompt() {
    const password = prompt("Please enter the password to access the site:");
    if (password !== "Cat#2011") {
        alert("Incorrect password. Access denied.");
        window.location.href = "http://127.0.0.1:5500/hello/error.html"; // Redirect to access denied page or another URL
    }
}
showPasswordPrompt(); // Call this function to prompt for password on page load
