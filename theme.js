// ===================================
// وحدة إدارة الثيمات
// ===================================
const ThemeManager = {
    init() {
        this.applySettings();
        this.setupEventListeners();
    },
    
    applySettings() {
        // تطبيق الثيم
        document.documentElement.setAttribute('data-theme', AppState.settings.theme);
        
        // تطبيق الوضع الداكن
        if (AppState.settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // تطبيق التباين العالي
        if (AppState.settings.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // تطبيق تقليل الحركة
        if (AppState.settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
        
        // تطبيق الخطوط
        this.applyFonts();
        
        // تطبيق حجم الخط
        document.documentElement.style.setProperty('--font-size-base', AppState.settings.fontSize + 'px');
        
        // تطبيق عرض المحرر
        document.documentElement.style.setProperty('--editor-width', AppState.settings.editorWidth + 'px');
    },
    
    applyFonts() {
        const fontMap = {
            'cairo': "'Cairo', sans-serif",
            'ibm-plex': "'IBM Plex Sans Arabic', sans-serif",
            'noto-sans': "'Noto Sans Arabic', sans-serif",
            'noto-naskh': "'Noto Naskh Arabic', serif",
            'amiri': "'Amiri', serif",
            'merriweather': "'Merriweather', serif"
        };
        
        document.documentElement.style.setProperty('--font-interface', fontMap[AppState.settings.interfaceFont]);
        document.documentElement.style.setProperty('--font-editor', fontMap[AppState.settings.editorFont]);
    },
    
    setTheme(theme) {
        AppState.settings.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        Storage.save('makhtouta_settings', AppState.settings);
    },
    
    toggleDarkMode() {
        AppState.settings.darkMode = !AppState.settings.darkMode;
        document.body.classList.toggle('dark-mode', AppState.settings.darkMode);
        Storage.save('makhtouta_settings', AppState.settings);
        
        // تحديث أيقونة الزر
        const btn = document.getElementById('mode-toggle');
        if (btn) {
            btn.innerHTML = AppState.settings.darkMode 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    },
    
    setupEventListeners() {
        // أزرار الثيمات في الإعدادات
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setTheme(btn.dataset.theme);
            });
        });
        
        // تبديل الوضع الداكن
        document.getElementById('mode-toggle')?.addEventListener('click', () => this.toggleDarkMode());
        
        // اختيار خطوط الواجهة
        document.getElementById('interface-font')?.addEventListener('change', (e) => {
            AppState.settings.interfaceFont = e.target.value;
            this.applyFonts();
            Storage.save('makhtouta_settings', AppState.settings);
        });
        
        // اختيار خطوط المحرر
        document.getElementById('editor-font')?.addEventListener('change', (e) => {
            AppState.settings.editorFont = e.target.value;
            this.applyFonts();
            Storage.save('makhtouta_settings', AppState.settings);
        });
        
        // شريط حجم الخط
        document.getElementById('font-size-slider')?.addEventListener('input', (e) => {
            AppState.settings.fontSize = parseInt(e.target.value);
            document.documentElement.style.setProperty('--font-size-base', AppState.settings.fontSize + 'px');
            document.getElementById('font-size-value').textContent = AppState.settings.fontSize + 'px';
            Storage.save('makhtouta_settings', AppState.settings);
        });
        
        // شريط عرض المحرر
        document.getElementById('editor-width-slider')?.addEventListener('input', (e) => {
            AppState.settings.editorWidth = parseInt(e.target.value);
            document.documentElement.style.setProperty('--editor-width', AppState.settings.editorWidth + 'px');
            document.getElementById('editor-width-value').textContent = AppState.settings.editorWidth + 'px';
            Storage.save('makhtouta_settings', AppState.settings);
        });
        
        // تبديل الحفظ التلقائي
        document.getElementById('auto-save-toggle')?.addEventListener('change', (e) => {
            AppState.settings.autoSave = e.target.checked;
            Storage.save('makhtouta_settings', AppState.settings);
        });
        
        // فاصل الحفظ التلقائي
        document.getElementById('auto-save-interval')?.addEventListener('change', (e) => {
            AppState.settings.autoSaveInterval = parseInt(e.target.value);
            Storage.save('makhtouta_settings', AppState.settings);
        });
        
        // تبديل التباين العالي
        document.getElementById('high-contrast-toggle')?.addEventListener('change', (e) => {
            AppState.settings.highContrast = e.target.checked;
            document.body.classList.toggle('high-contrast', AppState.settings.highContrast);
            Storage.save('makhtouta_settings', AppState.settings);
        });
        
        // تبديل تقليل الحركة
        document.getElementById('reduced-motion-toggle')?.addEventListener('change', (e) => {
            AppState.settings.reducedMotion = e.target.checked;
            document.body.classList.toggle('reduced-motion', AppState.settings.reducedMotion);
            Storage.save('makhtouta_settings', AppState.settings);
        });
    }
};