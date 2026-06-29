// ===================================
// التطبيق الرئيسي
// ===================================
const App = {
    init() {
        // تحميل البيانات المحفوظة
        Storage.loadAll();
        
        // تهيئة الثيمات
        ThemeManager.init();
        
        // تهيئة التنقل
        Navigation.init();
        
        // تهيئة المشاريع
        ProjectManager.init();
        
        // تهيئة المحرر
        RichTextEditor.init();
        
        // تهيئة الفصول
        ChapterManager.init();
        
        // تهيئة الشخصيات
        CharacterManager.init();
        
        // تهيئة الملاحظات
        NotesManager.init();
        
        // تهيئة الأهداف
        GoalsManager.init();
        
        // تهيئة الأماكن
        PlacesManager.init();
        
        // تهيئة الحبكات
        PlotsManager.init();
        
        // تهيئة الخط الزمني
        TimelineManager.init();
        
        // تهيئة المساعد الذكي
        AIAssistant.init();
        
        // تهيئة الإحصائيات
        StatisticsManager.init();
        
        // تهيئة شبكة العلاقات
        RelationshipsGraph.init();
        
        // تحديث البيانات كل دقيقة
        setInterval(() => {
            this.updateSessionTime();
        }, 60000);
        
        // الحفظ التلقائي الدوري
        setInterval(() => {
            if (AppState.settings.autoSave) {
                Storage.saveAll();
            }
        }, AppState.settings.autoSaveInterval * 1000);
        
        console.log('✅ تم تحميل منصة مخطوطة بنجاح');
    },
    
    updateSessionTime() {
        if (!AppState.writingSession.startTime) {
            AppState.writingSession.startTime = new Date();
        }
        
        const now = new Date();
        const diff = Math.floor((now - AppState.writingSession.startTime) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('session-time').textContent = `الجلسة: ${timeStr}`;
        
        // حساب سرعة الكتابة
        if (minutes > 0) {
            const speed = Math.round(AppState.writingSession.wordsWritten / minutes);
            document.getElementById('writing-speed').textContent = `السرعة: ${speed} كلمة/دقيقة`;
        }
    }
};

// ===================================
// بدء التطبيق عند تحميل الصفحة
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    SplashScreen.init();
});

// تسجيل كائنات النافذة للوصول من HTML
window.ProjectManager = ProjectManager;
window.ChapterManager = ChapterManager;
window.CharacterManager = CharacterManager;