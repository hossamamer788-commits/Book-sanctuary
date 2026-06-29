// ===================================
// محرر النصوص الغني
// ===================================
const RichTextEditor = {
    editor: null,
    history: [],
    historyIndex: -1,
    isFocusMode: false,
    autoSaveTimer: null,
    
    init() {
        this.editor = document.getElementById('editor');
        if (!this.editor) return;
        
        this.setupToolbar();
        this.setupEditorEvents();
        this.setupKeyboardShortcuts();
        this.loadChapter();
    },
    
    setupToolbar() {
        // أزرار التنسيق
        document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                document.execCommand(command, false, null);
                this.editor.focus();
                this.updateToolbarState();
            });
        });
        
        // اختيار العناوين
        document.getElementById('heading-select')?.addEventListener('change', (e) => {
            const format = e.target.value;
            if (format === 'p') {
                document.execCommand('formatBlock', false, 'p');
            } else {
                document.execCommand('formatBlock', false, format);
            }
            this.editor.focus();
        });
        
        // أزرار التراجع والإعادة
        document.getElementById('undo-btn')?.addEventListener('click', () => this.undo());
        document.getElementById('redo-btn')?.addEventListener('click', () => this.redo());
        
        // وضع التركيز
        document.getElementById('focus-mode-btn')?.addEventListener('click', () => this.toggleFocusMode());
        
        // وضع العرض
        document.getElementById('view-mode-select')?.addEventListener('change', (e) => {
            const editorPage = document.getElementById('editor-page');
            if (e.target.value === 'wide') {
                editorPage.classList.add('wide-mode');
            } else {
                editorPage.classList.remove('wide-mode');
            }
        });
        
        // البحث والاستبدال
        document.getElementById('find-replace-btn')?.addEventListener('click', () => {
            document.getElementById('find-replace-panel')?.classList.toggle('hidden');
        });
        
        this.setupFindReplace();
        
        // التصدير
        document.getElementById('export-pdf-btn')?.addEventListener('click', () => this.exportPDF());
        document.getElementById('export-txt-btn')?.addEventListener('click', () => this.exportTXT());

        // --- إضافة: أزرار إدراج صورة ورابط ---
        document.getElementById('insert-image-btn')?.addEventListener('click', () => this.insertImage());
        document.getElementById('insert-link-btn')?.addEventListener('click', () => this.insertLink());
    },
    
    setupEditorEvents() {
        if (!this.editor) return;
        
        this.editor.addEventListener('input', () => {
            this.updateWordCount();
            this.saveToHistory();
            this.scheduleAutoSave();
        });
        
        this.editor.addEventListener('keyup', () => {
            this.updateToolbarState();
        });
        
        this.editor.addEventListener('mouseup', () => {
            this.updateToolbarState();
        });
    },
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S للحفظ
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveChapter();
            }
            
            // Ctrl+B للغامق
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold', false, null);
            }
            
            // Ctrl+I للمائل
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic', false, null);
            }
            
            // Ctrl+U للتسطير
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                document.execCommand('underline', false, null);
            }
            
            // Ctrl+Z للتراجع
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            
            // Ctrl+Y أو Ctrl+Shift+Z للإعادة
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                this.redo();
            }
            
            // Ctrl+K للبحث الشامل
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('global-search')?.focus();
            }
            
            // Ctrl+F للبحث في المحرر
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                document.getElementById('find-replace-panel')?.classList.remove('hidden');
                document.getElementById('find-input')?.focus();
            }
        });
    },
    
    setupFindReplace() {
        const findInput = document.getElementById('find-input');
        const replaceInput = document.getElementById('replace-input');
        
        document.getElementById('find-next-btn')?.addEventListener('click', () => {
            this.findNext(findInput.value);
        });
        
        document.getElementById('find-prev-btn')?.addEventListener('click', () => {
            this.findPrevious(findInput.value);
        });
        
        document.getElementById('replace-btn')?.addEventListener('click', () => {
            this.replace(replaceInput.value);
        });
        
        document.getElementById('replace-all-btn')?.addEventListener('click', () => {
            this.replaceAll(findInput.value, replaceInput.value);
        });
        
        document.getElementById('close-find-replace')?.addEventListener('click', () => {
            document.getElementById('find-replace-panel')?.classList.add('hidden');
        });
    },
    
    findNext(searchText) {
        if (!searchText) return;
        
        const selection = window.getSelection();
        const range = document.createRange();
        
        // بحث بسيط (يمكن تحسينه)
        const content = this.editor.innerHTML;
        const index = content.indexOf(searchText);
        
        if (index !== -1) {
            // تمييز النص (تنفيذ مبسط)
            Notifications.show('تم العثور على النص', 'success');
        } else {
            Notifications.show('لم يتم العثور على النص', 'warning');
        }
    },
    
    findPrevious(searchText) {
        // تنفيذ مبسط
        this.findNext(searchText);
    },
    
    replace(replaceText) {
        document.execCommand('insertText', false, replaceText);
    },
    
    replaceAll(searchText, replaceText) {
        if (!searchText) return;
        
        const content = this.editor.innerHTML;
        const newContent = content.split(searchText).join(replaceText);
        this.editor.innerHTML = newContent;
        
        this.updateWordCount();
        Notifications.show('تم استبدال جميع occurrences', 'success');
    },
    
    updateToolbarState() {
        document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
            const command = btn.dataset.command;
            try {
                const isActive = document.queryCommandState(command);
                btn.classList.toggle('active', isActive);
            } catch (e) {
                // تجاهل الأخطاء
            }
        });
    },
    
    saveToHistory() {
        if (!this.editor) return;
        
        const content = this.editor.innerHTML;
        
        // إزالة التاريخ القديم إذا تجاوز الحد
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(content);
        this.historyIndex++;
        
        // الاحتفاظ بآخر 50 حالة فقط
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    },
    
    undo() {
        if (this.historyIndex > 0 && this.editor) {
            this.historyIndex--;
            this.editor.innerHTML = this.history[this.historyIndex];
            this.updateWordCount();
        }
    },
    
    redo() {
        if (this.historyIndex < this.history.length - 1 && this.editor) {
            this.historyIndex++;
            this.editor.innerHTML = this.history[this.historyIndex];
            this.updateWordCount();
        }
    },
    
    toggleFocusMode() {
        this.isFocusMode = !this.isFocusMode;
        
        const sidebar = document.getElementById('sidebar');
        const topBar = document.querySelector('.top-bar');
        const toolbar = document.querySelector('.editor-toolbar');
        const statusBar = document.querySelector('.status-bar');
        const chaptersSidebar = document.getElementById('chapters-sidebar');
        
        if (this.isFocusMode) {
            sidebar?.classList.add('hidden');
            topBar?.classList.add('hidden');
            toolbar?.classList.add('hidden');
            statusBar?.classList.add('hidden');
            chaptersSidebar?.classList.add('hidden');
        } else {
            sidebar?.classList.remove('hidden');
            topBar?.classList.remove('hidden');
            toolbar?.classList.remove('hidden');
            statusBar?.classList.remove('hidden');
        }
        
        document.getElementById('focus-mode-btn')?.classList.toggle('active', this.isFocusMode);
    },
    
    updateWordCount() {
        if (!this.editor) return;
        
        const text = this.editor.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const pages = Math.ceil(words / 250); // تقريباً 250 كلمة في الصفحة
        
        document.getElementById('word-count').textContent = `كلمات: ${words}`;
        document.getElementById('char-count').textContent = `أحرف: ${chars}`;
        document.getElementById('page-count').textContent = `صفحات: ${pages}`;
        document.getElementById('chapter-words').textContent = `${words} كلمة`;
        
        // تحديث إحصائيات الجلسة
        AppState.writingSession.wordsWritten = words;
    },
    
    scheduleAutoSave() {
        if (!AppState.settings.autoSave) return;
        
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveChapter();
        }, AppState.settings.autoSaveInterval * 1000);
        
        // تحديث حالة الحفظ
        const saveStatus = document.getElementById('save-status');
        if (saveStatus) {
            saveStatus.innerHTML = '<i class="fas fa-circle-notch spin"></i> جاري الحفظ...';
            saveStatus.style.color = 'var(--warning)';
        }
    },
    
    saveChapter() {
        if (!AppState.currentProject || !AppState.currentChapter) {
            return;
        }
        
        const chapterContent = this.editor?.innerHTML || '';
        const chapterTitle = document.getElementById('chapter-title')?.value || '';
        
        // تحديث الفصل في المشروع
        const project = AppState.projects.find(p => p.id === AppState.currentProject.id);
        if (project) {
            const chapter = project.chapters?.find(c => c.id === AppState.currentChapter.id);
            if (chapter) {
                chapter.content = chapterContent;
                chapter.title = chapterTitle;
                chapter.lastModified = new Date().toISOString();
                chapter.wordCount = this.getWordCount();
            }
        }
        
        Storage.saveAll();
        
        // تحديث حالة الحفظ
        const saveStatus = document.getElementById('save-status');
        if (saveStatus) {
            saveStatus.innerHTML = '<i class="fas fa-check"></i> محفوظ';
            saveStatus.style.color = 'var(--success)';
        }
        
        AppState.writingSession.lastSaveTime = new Date();
        
        // --- إضافة: تحديث تقدم الأهداف بعد الحفظ ---
        GoalsManager.updateProgress();
    },
    
    getWordCount() {
        if (!this.editor) return 0;
        const text = this.editor.innerText || '';
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    },
    
    loadChapter() {
        if (!AppState.currentChapter) {
            if (this.editor) this.editor.innerHTML = '';
            document.getElementById('chapter-title').value = '';
            return;
        }
        
        if (this.editor) {
            this.editor.innerHTML = AppState.currentChapter.content || '';
            this.history = [AppState.currentChapter.content || ''];
            this.historyIndex = 0;
        }
        
        document.getElementById('chapter-title').value = AppState.currentChapter.title || '';
        this.updateWordCount();
    },
    
    exportPDF() {
        // تصدير بسيط إلى PDF (يمكن تحسينه باستخدام مكتبة)
        const content = this.editor?.innerHTML || '';
        const title = document.getElementById('chapter-title')?.value || 'بدون عنوان';
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <style>
                    body { font-family: 'Cairo', sans-serif; padding: 40px; line-height: 1.8; }
                    h1, h2, h3, h4 { color: #6F4E37; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                ${content}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        
        Notifications.show('جاري التحضير للطباعة/التصدير', 'info');
    },
    
    exportTXT() {
        const content = this.editor?.innerText || '';
        const title = document.getElementById('chapter-title')?.value || 'بدون عنوان';
        
        const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        Notifications.show('تم تصدير الملف', 'success');
    },

    // --- إضافة: إدراج صورة ---
    insertImage() {
        const url = prompt('أدخل رابط الصورة:');
        if (url) {
            document.execCommand('insertImage', false, url);
            this.editor.focus();
            this.updateWordCount();
            this.saveToHistory();
        }
    },

    // --- إضافة: إدراج رابط ---
    insertLink() {
        const url = prompt('أدخل الرابط:');
        if (url) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && selection.toString().trim()) {
                document.execCommand('createLink', false, url);
            } else {
                const text = prompt('أدخل النص المعروض:');
                if (text) {
                    document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
                }
            }
            this.editor.focus();
            this.saveToHistory();
        }
    }
};