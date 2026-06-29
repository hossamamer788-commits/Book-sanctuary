// ===================================
// إدارة الشخصيات
// ===================================
const CharacterManager = {
    init() {
        this.setupEventListeners();
        this.renderCharacters();
    },
    
    setupEventListeners() {
        document.getElementById('add-character-btn')?.addEventListener('click', () => this.openModal());
        
        document.getElementById('character-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCharacter();
        });
        
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        document.getElementById('back-to-characters')?.addEventListener('click', () => {
            document.getElementById('character-detail')?.classList.add('hidden');
            document.getElementById('characters-list')?.classList.remove('hidden');
        });
        
        document.getElementById('characters-search')?.addEventListener('input', () => this.renderCharacters());
        document.getElementById('characters-filter')?.addEventListener('change', () => this.renderCharacters());
    },
    
    openModal(character = null) {
        const modal = document.getElementById('character-modal');
        const title = document.getElementById('character-modal-title');
        const form = document.getElementById('character-form');
        
        if (character) {
            title.textContent = 'تعديل الشخصية';
            document.getElementById('char-name').value = character.name;
            document.getElementById('char-nickname').value = character.nickname || '';
            document.getElementById('char-age').value = character.age || '';
            document.getElementById('char-gender').value = character.gender || 'male';
            document.getElementById('char-role').value = character.role || 'main';
            document.getElementById('char-description').value = character.description || '';
            document.getElementById('char-personality').value = character.personality || '';
            document.getElementById('char-background').value = character.background || '';
            document.getElementById('char-motivation').value = character.motivation || '';
            form.dataset.editId = character.id;
        } else {
            title.textContent = 'شخصية جديدة';
            form.reset();
            delete form.dataset.editId;
        }
        
        modal.classList.remove('hidden');
    },
    
    closeModal() {
        document.getElementById('character-modal')?.classList.add('hidden');
    },
    
    saveCharacter() {
        const form = document.getElementById('character-form');
        const editId = form.dataset.editId;
        
        const characterData = {
            id: editId || this.generateId(),
            name: document.getElementById('char-name').value,
            nickname: document.getElementById('char-nickname').value,
            age: document.getElementById('char-age').value,
            gender: document.getElementById('char-gender').value,
            role: document.getElementById('char-role').value,
            description: document.getElementById('char-description').value,
            personality: document.getElementById('char-personality').value,
            background: document.getElementById('char-background').value,
            motivation: document.getElementById('char-motivation').value,
            createdAt: editId ? AppState.characters.find(c => c.id === editId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (editId) {
            const index = AppState.characters.findIndex(c => c.id === editId);
            if (index !== -1) {
                AppState.characters[index] = characterData;
            }
        } else {
            AppState.characters.push(characterData);
        }
        
        Storage.saveAll();
        this.closeModal();
        this.renderCharacters();
        Notifications.show('تم حفظ الشخصية بنجاح', 'success');
    },
    
    deleteCharacter(id) {
        if (!confirm('هل أنت متأكد من حذف هذه الشخصية؟')) return;
        
        AppState.characters = AppState.characters.filter(c => c.id !== id);
        Storage.saveAll();
        this.renderCharacters();
        Notifications.show('تم حذف الشخصية', 'success');
    },
    
    renderCharacters() {
        const container = document.getElementById('characters-list');
        if (!container) return;
        
        let characters = [...AppState.characters];
        
        // فلترة
        const filter = document.getElementById('characters-filter')?.value || 'all';
        if (filter !== 'all') {
            characters = characters.filter(c => c.role === filter);
        }
        
        // بحث
        const search = document.getElementById('characters-search')?.value || '';
        if (search) {
            characters = characters.filter(c => 
                c.name.includes(search) || 
                (c.nickname && c.nickname.includes(search))
            );
        }
        
        container.innerHTML = characters.map(character => `
            <div class="character-card" data-id="${character.id}">
                <div class="character-avatar">
                    ${character.name.charAt(0)}
                </div>
                <h4>${character.name}</h4>
                <p>${character.nickname || character.description?.substring(0, 50) || ''}</p>
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">
                    <span>${this.getRoleName(character.role)}</span>
                </div>
            </div>
        `).join('');
        
        // إضافة مستمعي الأحداث
        container.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', () => this.showDetail(card.dataset.id));
        });
    },
    
    showDetail(id) {
        const character = AppState.characters.find(c => c.id === id);
        if (!character) return;
        
        const detailContainer = document.getElementById('character-detail');
        const listContainer = document.getElementById('characters-list');
        
        document.getElementById('character-detail-name').textContent = character.name;
        
        document.getElementById('character-detail-content').innerHTML = `
            <div class="detail-content">
                ${character.nickname ? `<h4>اللقب</h4><p>${character.nickname}</p>` : ''}
                ${character.age ? `<h4>العمر</h4><p>${character.age} سنة</p>` : ''}
                <h4>الجنس</h4>
                <p>${character.gender === 'male' ? 'ذكر' : character.gender === 'female' ? 'أنثى' : 'آخر'}</p>
                <h4>الدور</h4>
                <p>${this.getRoleName(character.role)}</p>
                ${character.description ? `<h4>الوصف</h4><p>${character.description}</p>` : ''}
                ${character.personality ? `<h4>الشخصية</h4><p>${character.personality}</p>` : ''}
                ${character.background ? `<h4>الخلفية</h4><p>${character.background}</p>` : ''}
                ${character.motivation ? `<h4>الدوافع</h4><p>${character.motivation}</p>` : ''}
            </div>
        `;
        
        listContainer.classList.add('hidden');
        detailContainer.classList.remove('hidden');
        
        // زر التعديل
        document.getElementById('edit-character-btn')?.addEventListener('click', () => {
            this.openModal(character);
        });
        
        // زر الحذف
        document.getElementById('delete-character-btn')?.addEventListener('click', () => {
            this.deleteCharacter(id);
            detailContainer.classList.add('hidden');
            listContainer.classList.remove('hidden');
        });
    },
    
    getRoleName(role) {
        const names = {
            'main': 'رئيسي',
            'secondary': 'ثانوي',
            'minor': 'ثانوي جداً'
        };
        return names[role] || role;
    },
    
    generateId() {
        return 'char_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};