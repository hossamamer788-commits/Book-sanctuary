// ===================================
// وحدة التنقل
// ===================================
const Navigation = {
    currentSection: 'dashboard',
    
    init() {
        this.setupEventListeners();
        this.showSection('dashboard');
    },
    
    showSection(sectionId) {
        // إخفاء جميع الأقسام
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // إظهار القسم المطلوب
        const targetSection = document.getElementById(sectionId + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // تحديث حالة أزرار التنقل
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });
        
        this.currentSection = sectionId;
        
        // تحديث العنوان
        this.updateBreadcrumb(sectionId);
        
        // إغلاق القائمة الجانبية على الموبايل
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar')?.classList.remove('open');
        }
    },
    
    updateBreadcrumb(sectionId) {
        const titles = {
            'dashboard': 'لوحة التحكم',
            'projects': 'المشاريع',
            'editor': 'المحرر',
            'characters': 'الشخصيات',
            'places': 'الأماكن',
            'plots': 'الحبكات',
            'timeline': 'الخط الزمني',
            'notes': 'الملاحظات',
            'goals': 'الأهداف',
            'statistics': 'الإحصائيات',
            'settings': 'الإعدادات'
        };
        
        document.title = titles[sectionId] + ' | مخطوطة';
    },
    
    setupEventListeners() {
        // أزرار التنقل الجانبية
        document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showSection(btn.dataset.section);
            });
        });
        
        // زر القائمة على الموبايل
        document.getElementById('menu-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('open');
        });
        
        // البحث الشامل
        document.getElementById('global-search')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.globalSearch(e.target.value);
            }
        });
    },
    
    globalSearch(query) {
        if (!query.trim()) return;
        
        const results = [];
        
        // بحث في المشاريع
        AppState.projects.forEach(project => {
            if (project.name.includes(query)) {
                results.push({ type: 'project', data: project });
            }
        });
        
        // بحث في الشخصيات
        AppState.characters.forEach(char => {
            if (char.name.includes(query)) {
                results.push({ type: 'character', data: char });
            }
        });
        
        // بحث في الملاحظات
        AppState.notes.forEach(note => {
            if (note.title.includes(query) || note.content.includes(query)) {
                results.push({ type: 'note', data: note });
            }
        });
        
        // عرض النتائج (يمكن تحسين هذا لاحقاً)
        if (results.length > 0) {
            Notifications.show(`تم العثور على ${results.length} نتيجة`, 'success');
        } else {
            Notifications.show('لم يتم العثور على نتائج', 'warning');
        }
    }
};