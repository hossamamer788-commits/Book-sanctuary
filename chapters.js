// ===================================
// إدارة الفصول
// ===================================
const ChapterManager = {
    init() {
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        document.getElementById('add-chapter-btn')?.addEventListener('click', () => this.addChapter());
        
        document.getElementById('chapter-title')?.addEventListener('input', () => {
            if (AppState.currentChapter) {
                AppState.currentChapter.title = document.getElementById('chapter-title').value;
            }
        });

        // --- إضافة: بحث في الفصول ---
        document.getElementById('chapter-search')?.addEventListener('input', (e) => {
            this.searchChapters(e.target.value);
        });
    },
    
    renderChapters() {
        const container = document.getElementById('chapters-list');
        if (!container || !AppState.currentProject) return;
        
        const chapters = AppState.currentProject.chapters || [];
        
        container.innerHTML = chapters.map((chapter, index) => `
            <div class="chapter-item ${AppState.currentChapter?.id === chapter.id ? 'active' : ''}" data-id="${chapter.id}">
                <div class="chapter-info">
                    <span class="chapter-number">فصل ${index + 1}</span>
                    <span class="chapter-title">${chapter.title || 'بدون عنوان'}</span>
                </div>
                <div class="chapter-item-actions">
                    <button class="edit-chapter" data-id="${chapter.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-chapter" data-id="${chapter.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // إضافة مستمعي الأحداث
        container.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.chapter-item-actions')) {
                    this.loadChapter(item.dataset.id);
                }
            });
        });
        
        container.querySelectorAll('.delete-chapter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChapter(btn.dataset.id);
            });
        });
    },
    
    addChapter() {
        if (!AppState.currentProject) {
            Notifications.show('يجب فتح مشروع أولاً', 'warning');
            return;
        }
        
        const newChapter = {
            id: this.generateId(),
            title: `فصل جديد ${AppState.currentProject.chapters?.length + 1 || 1}`,
            content: '',
            wordCount: 0,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        if (!AppState.currentProject.chapters) {
            AppState.currentProject.chapters = [];
        }
        
        AppState.currentProject.chapters.push(newChapter);
        
        // تحديث في المشاريع
        const projectIndex = AppState.projects.findIndex(p => p.id === AppState.currentProject.id);
        if (projectIndex !== -1) {
            AppState.projects[projectIndex] = AppState.currentProject;
        }
        
        Storage.saveAll();
        this.renderChapters();
        this.loadChapter(newChapter.id);
        Notifications.show('تم إضافة الفصل', 'success');
    },
    
    loadChapter(chapterId) {
        const chapter = AppState.currentProject.chapters?.find(c => c.id === chapterId);
        if (!chapter) return;
        
        // حفظ الفصل الحالي قبل التحميل
        if (AppState.currentChapter) {
            RichTextEditor.saveChapter();
        }
        
        AppState.currentChapter = chapter;
        RichTextEditor.loadChapter();
        this.renderChapters();
    },
    
    deleteChapter(chapterId) {
        if (!confirm('هل أنت متأكد من حذف هذا الفصل؟')) return;
        
        AppState.currentProject.chapters = AppState.currentProject.chapters.filter(c => c.id !== chapterId);
        
        // تحديث في المشاريع
        const projectIndex = AppState.projects.findIndex(p => p.id === AppState.currentProject.id);
        if (projectIndex !== -1) {
            AppState.projects[projectIndex] = AppState.currentProject;
        }
        
        AppState.currentChapter = null;
        RichTextEditor.loadChapter();
        this.renderChapters();
        Storage.saveAll();
        Notifications.show('تم حذف الفصل', 'success');
    },
    
    generateId() {
        return 'ch_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // --- إضافة: بحث في الفصول ---
    searchChapters(query) {
        if (!AppState.currentProject) return;
        const container = document.getElementById('chapters-list');
        const chapters = AppState.currentProject.chapters || [];
        const filtered = query ? chapters.filter(ch => 
            ch.title.includes(query) || (ch.content && ch.content.includes(query))
        ) : chapters;
        // إعادة عرض القائمة مع التصفية
        container.innerHTML = filtered.map((chapter, index) => `
            <div class="chapter-item ${AppState.currentChapter?.id === chapter.id ? 'active' : ''}" data-id="${chapter.id}">
                <div class="chapter-info">
                    <span class="chapter-number">فصل ${index + 1}</span>
                    <span class="chapter-title">${chapter.title || 'بدون عنوان'}</span>
                </div>
                <div class="chapter-item-actions">
                    <button class="edit-chapter" data-id="${chapter.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-chapter" data-id="${chapter.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        // إعادة ربط الأحداث (نفس المنطق السابق)
        container.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.chapter-item-actions')) {
                    this.loadChapter(item.dataset.id);
                }
            });
        });
        container.querySelectorAll('.delete-chapter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChapter(btn.dataset.id);
            });
        });
    }
};