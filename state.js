/* ===================================
   منصة مخطوطة - التطبيق الرئيسي
   =================================== */

// ===================================
// وحدة إدارة الحالة العامة
// ===================================
const AppState = {
    currentProject: null,
    currentChapter: null,
    projects: [],
    characters: [],
    places: [],
    plots: [],
    timelines: [],
    notes: [],
    goals: [],
    settings: {
        theme: 'coffee',
        darkMode: false,
        interfaceFont: 'cairo',
        editorFont: 'cairo',
        fontSize: 16,
        editorWidth: 800,
        autoSave: true,
        autoSaveInterval: 30,
        highContrast: false,
        reducedMotion: false
    },
    writingSession: {
        startTime: null,
        wordsWritten: 0,
        lastSaveTime: null
    }
};