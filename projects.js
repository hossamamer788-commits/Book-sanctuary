// ===================================
// إدارة المشاريع
// ===================================
const ProjectManager = {
    init() {
        this.setupEventListeners();
        this.renderProjects();
        this.updateDashboard();
    },
    
    setupEventListeners() {
        document.getElementById('new-project-btn')?.addEventListener('click', () => this.openModal());
        document.getElementById('create-project-btn')?.addEventListener('click', () => this.openModal());
        
        document.getElementById('project-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });
        
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // بحث وفرز المشاريع
        document.getElementById('projects-search')?.addEventListener('input', () => this.renderProjects());
        document.getElementById('projects-filter')?.addEventListener('change', () => this.renderProjects());
        document.getElementById('projects-sort')?.addEventListener('change', () => this.renderProjects());

        // --- إضافة: زر تصدير المشروع ---
        document.getElementById('export-project-btn')?.addEventListener('click', () => {
            if (AppState.currentProject) {
                this.exportProject(AppState.currentProject.id);
            } else {
                Notifications.show('افتح مشروعاً أولاً', 'warning');
            }
        });

        // --- إضافة: زر استيراد مشروع (في الإعدادات) ---
        document.getElementById('import-project-btn')?.addEventListener('click', () => {
            document.getElementById('import-project-file')?.click();
        });
        document.getElementById('import-project-file')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const json = ev.target.result;
                    if (Storage.importProject(json)) {
                        this.renderProjects();
                        this.updateDashboard();
                        Notifications.show('تم استيراد المشروع', 'success');
                    } else {
                        Notifications.show('فشل استيراد المشروع', 'error');
                    }
                };
                reader.readAsText(file);
            }
            e.target.value = '';
        });
    },
    
    openModal(project = null) {
        const modal = document.getElementById('project-modal');
        const title = document.getElementById('project-modal-title');
        const form = document.getElementById('project-form');
        
        if (project) {
            title.textContent = 'تعديل المشروع';
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-genre').value = project.genre;
            document.getElementById('project-description').value = project.description || '';
            document.getElementById('project-language').value = project.language;
            document.getElementById('project-status').value = project.status;
            form.dataset.editId = project.id;
        } else {
            title.textContent = 'مشروع جديد';
            form.reset();
            delete form.dataset.editId;
        }
        
        modal.classList.remove('hidden');
    },
    
    closeModal() {
        document.getElementById('project-modal')?.classList.add('hidden');
    },
    
    saveProject() {
        const form = document.getElementById('project-form');
        const editId = form.dataset.editId;
        
        const projectData = {
            name: document.getElementById('project-name').value,
            genre: document.getElementById('project-genre').value,
            description: document.getElementById('project-description').value,
            language: document.getElementById('project-language').value,
            status: document.getElementById('project-status').value,
            createdAt: editId ? AppState.projects.find(p => p.id === editId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            chapters: editId ? AppState.projects.find(p => p.id === editId)?.chapters || [] : [],
            id: editId || this.generateId()
        };
        
        if (editId) {
            const index = AppState.projects.findIndex(p => p.id === editId);
            if (index !== -1) {
                AppState.projects[index] = projectData;
            }
        } else {
            AppState.projects.push(projectData);
        }
        
        Storage.saveAll();
        this.closeModal();
        this.renderProjects();
        this.updateDashboard();
        Notifications.show('تم حفظ المشروع بنجاح', 'success');
    },
    
    deleteProject(id) {
        if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
        
        AppState.projects = AppState.projects.filter(p => p.id !== id);
        Storage.saveAll();
        this.renderProjects();
        this.updateDashboard();
        Notifications.show('تم حذف المشروع', 'success');
    },
    
    openProject(id) {
        const project = AppState.projects.find(p => p.id === id);
        if (!project) return;
        
        AppState.currentProject = project;
        Navigation.showSection('editor');
        ChapterManager.renderChapters();
        Notifications.show(`تم فتح مشروع: ${project.name}`, 'success');
    },
    
    renderProjects() {
        const container = document.getElementById('projects-list');
        const recentContainer = document.getElementById('recent-projects-list');
        
        if (!container) return;
        
        let projects = [...AppState.projects];
        
        // فلترة
        const filter = document.getElementById('projects-filter')?.value || 'all';
        if (filter !== 'all') {
            projects = projects.filter(p => p.status === filter);
        }
        
        // بحث
        const search = document.getElementById('projects-search')?.value || '';
        if (search) {
            projects = projects.filter(p => 
                p.name.includes(search) || 
                (p.description && p.description.includes(search))
            );
        }
        
        // فرز
        const sort = document.getElementById('projects-sort')?.value || 'date';
        if (sort === 'date') {
            projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sort === 'name') {
            projects.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        } else if (sort === 'words') {
            projects.sort((a, b) => this.getProjectWords(b) - this.getProjectWords(a));
        }
        
        // عرض المشاريع
        container.innerHTML = projects.map(project => this.createProjectCard(project)).join('');
        
        // عرض آخر المشاريع في لوحة التحكم
        if (recentContainer) {
            const recent = projects.slice(0, 4);
            recentContainer.innerHTML = recent.map(project => this.createProjectCard(project)).join('');
        }
        
        // إضافة مستمعي الأحداث
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => this.openProject(card.dataset.id));
        });
        
        container.querySelectorAll('.delete-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteProject(btn.dataset.id);
            });
        });

        // --- إضافة: زر تصدير المشروع الفردي في البطاقة ---
        container.querySelectorAll('.export-project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.exportProject(btn.dataset.id);
            });
        });
    },
    
    createProjectCard(project) {
        const wordCount = this.getProjectWords(project);
        const chapterCount = project.chapters?.length || 0;
        
        const genreNames = {
            'novel': 'رواية',
            'story': 'قصة قصيرة',
            'script': 'سيناريو',
            'nonfiction': 'غير خيالي',
            'poetry': 'شعر',
            'other': 'آخر'
        };
        
        const statusNames = {
            'draft': 'مسودة',
            'writing': 'قيد الكتابة',
            'completed': 'مكتمل'
        };
        
        return `
            <div class="project-card" data-id="${project.id}">
                <h4>${project.name}</h4>
                <p>${project.description || 'لا يوجد وصف'}</p>
                <div class="project-stats">
                    <span><i class="fas fa-file-alt"></i> ${wordCount} كلمة</span>
                    <span><i class="fas fa-bookmark"></i> ${chapterCount} فصل</span>
                    <span><i class="fas fa-tag"></i> ${genreNames[project.genre]}</span>
                    <span><i class="fas fa-circle" style="color: ${this.getStatusColor(project.status)}"></i> ${statusNames[project.status]}</span>
                </div>
                <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); ProjectManager.openProject('${project.id}')">
                        <i class="fas fa-folder-open"></i> فتح
                    </button>
                    <button class="btn btn-sm btn-icon export-project-btn" data-id="${project.id}">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-icon delete-project" data-id="${project.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },
    
    getProjectWords(project) {
        return project.chapters?.reduce((total, chapter) => total + (chapter.wordCount || 0), 0) || 0;
    },
    
    getStatusColor(status) {
        const colors = {
            'draft': '#999',
            'writing': '#4CAF50',
            'completed': '#2196F3'
        };
        return colors[status] || '#999';
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    updateDashboard() {
        // تحديث إحصائيات لوحة التحكم
        document.getElementById('total-projects').textContent = AppState.projects.length;
        
        const totalWords = AppState.projects.reduce((total, p) => total + this.getProjectWords(p), 0);
        document.getElementById('total-words').textContent = totalWords.toLocaleString();
        
        document.getElementById('total-characters').textContent = AppState.characters.length;
        document.getElementById('total-places').textContent = AppState.places.length;
        
        // تحديث الأهداف اليومية
        this.updateDailyGoals();

        // --- إضافة: تحديث إحصائيات الكلمات اليومية والأسبوعية ---
        const dailyWords = StatisticsManager.calculateDailyWords();
        document.getElementById('daily-words-count').textContent = `${dailyWords} / ${document.getElementById('daily-words-count').textContent.split('/')[1]?.trim() || 1000}`;
    },
    
    updateDailyGoals() {
        const today = new Date().toDateString();
        const todayGoal = AppState.goals.find(g => g.period === 'daily' && g.targetDate === today);
        const target = todayGoal?.target || 1000;
        
        // حساب كلمات اليوم (محسوب بالفعل في StatisticsManager)
        const todayWords = StatisticsManager.calculateDailyWords();
        
        document.getElementById('daily-words-count').textContent = `${todayWords} / ${target}`;
        
        const percentage = Math.min((todayWords / target) * 100, 100);
        document.getElementById('daily-progress').style.width = percentage + '%';
    },

    // --- إضافة: تصدير مشروع فردي ---
    exportProject(id) {
        const json = Storage.exportProject(id);
        if (!json) {
            Notifications.show('لم يتم العثور على المشروع', 'error');
            return;
        }
        const project = AppState.projects.find(p => p.id === id);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name || 'project'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Notifications.show('تم تصدير المشروع', 'success');
    }
};