// ===================================
// إدارة الملاحظات
// ===================================
const NotesManager = {
    init() {
        this.setupEventListeners();
        this.renderNotes();
    },
    
    setupEventListeners() {
        document.getElementById('add-note-btn')?.addEventListener('click', () => this.showEditor());
        
        document.getElementById('save-note-btn')?.addEventListener('click', () => this.saveNote());
        
        document.getElementById('cancel-note-btn')?.addEventListener('click', () => {
            document.getElementById('note-editor')?.classList.add('hidden');
            document.getElementById('notes-list')?.classList.remove('hidden');
        });
        
        // اختيار الألوان
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },
    
    showEditor(note = null) {
        const editor = document.getElementById('note-editor');
        const list = document.getElementById('notes-list');
        
        if (note) {
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            document.querySelectorAll('.color-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.color === note.color);
            });
            editor.dataset.editId = note.id;
        } else {
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.color-btn[data-color="default"]')?.classList.add('active');
            delete editor.dataset.editId;
        }
        
        list.classList.add('hidden');
        editor.classList.remove('hidden');
    },
    
    saveNote() {
        const editor = document.getElementById('note-editor');
        const editId = editor.dataset.editId;
        const color = document.querySelector('.color-btn.active')?.dataset.color || 'default';
        
        const noteData = {
            id: editId || this.generateId(),
            title: document.getElementById('note-title').value,
            content: document.getElementById('note-content').value,
            color: color,
            createdAt: editId ? AppState.notes.find(n => n.id === editId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (editId) {
            const index = AppState.notes.findIndex(n => n.id === editId);
            if (index !== -1) {
                AppState.notes[index] = noteData;
            }
        } else {
            AppState.notes.push(noteData);
        }
        
        Storage.saveAll();
        this.renderNotes();
        document.getElementById('note-editor')?.classList.add('hidden');
        document.getElementById('notes-list')?.classList.remove('hidden');
        Notifications.show('تم حفظ الملاحظة', 'success');
    },
    
    renderNotes() {
        const container = document.getElementById('notes-list');
        if (!container) return;
        
        container.innerHTML = AppState.notes.map(note => `
            <div class="note-card" data-color="${note.color}" data-id="${note.id}">
                <h4>${note.title || 'بدون عنوان'}</h4>
                <p>${note.content?.substring(0, 100) || ''}</p>
            </div>
        `).join('');
        
        // إضافة مستمعي الأحداث
        container.querySelectorAll('.note-card').forEach(card => {
            card.addEventListener('click', () => {
                const note = AppState.notes.find(n => n.id === card.dataset.id);
                if (note) this.showEditor(note);
            });
        });
    },
    
    generateId() {
        return 'note_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};