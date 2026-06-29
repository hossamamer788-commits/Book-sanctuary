// ===================================
// وحدة التخزين المحلي
// ===================================
const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('فشل الحفظ في localStorage:', e);
            return false;
        }
    },
    
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('فشل التحميل من localStorage:', e);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('فشل الحذف من localStorage:', e);
            return false;
        }
    },
    
    saveAll() {
        this.save('makhtouta_projects', AppState.projects);
        this.save('makhtouta_characters', AppState.characters);
        this.save('makhtouta_places', AppState.places);
        this.save('makhtouta_plots', AppState.plots);
        this.save('makhtouta_timelines', AppState.timelines);
        this.save('makhtouta_notes', AppState.notes);
        this.save('makhtouta_goals', AppState.goals);
        this.save('makhtouta_settings', AppState.settings);
        this.save('makhtouta_current_project', AppState.currentProject);
    },
    
    loadAll() {
        AppState.projects = this.load('makhtouta_projects') || [];
        AppState.characters = this.load('makhtouta_characters') || [];
        AppState.places = this.load('makhtouta_places') || [];
        AppState.plots = this.load('makhtouta_plots') || [];
        AppState.timelines = this.load('makhtouta_timelines') || [];
        AppState.notes = this.load('makhtouta_notes') || [];
        AppState.goals = this.load('makhtouta_goals') || [];
        
        const savedSettings = this.load('makhtouta_settings');
        if (savedSettings) {
            AppState.settings = { ...AppState.settings, ...savedSettings };
        }
        
        AppState.currentProject = this.load('makhtouta_current_project');
    },
    
    exportData() {
        const data = {
            projects: AppState.projects,
            characters: AppState.characters,
            places: AppState.places,
            plots: AppState.plots,
            timelines: AppState.timelines,
            notes: AppState.notes,
            goals: AppState.goals,
            settings: AppState.settings,
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    },
    
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.projects) AppState.projects = data.projects;
            if (data.characters) AppState.characters = data.characters;
            if (data.places) AppState.places = data.places;
            if (data.plots) AppState.plots = data.plots;
            if (data.timelines) AppState.timelines = data.timelines;
            if (data.notes) AppState.notes = data.notes;
            if (data.goals) AppState.goals = data.goals;
            if (data.settings) AppState.settings = { ...AppState.settings, ...data.settings };
            this.saveAll();
            return true;
        } catch (e) {
            console.error('فشل استيراد البيانات:', e);
            return false;
        }
    },

    // --- إضافة: تصدير مشروع فردي ---
    exportProject(projectId) {
        const project = AppState.projects.find(p => p.id === projectId);
        if (!project) return null;
        return JSON.stringify(project, null, 2);
    },

    // --- إضافة: استيراد مشروع فردي ---
    importProject(jsonString) {
        try {
            const project = JSON.parse(jsonString);
            if (!project.id || !project.name) throw new Error('بيانات المشروع غير صالحة');
            // تجنب تكرار المعرف
            if (AppState.projects.some(p => p.id === project.id)) {
                project.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
            }
            AppState.projects.push(project);
            this.saveAll();
            return true;
        } catch (e) {
            console.error('فشل استيراد المشروع:', e);
            return false;
        }
    }
};